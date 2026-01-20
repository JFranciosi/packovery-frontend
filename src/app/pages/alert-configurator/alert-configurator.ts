import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { SidebarComponent } from '../../component/sidebar/sidebar';

import { AlertResponse } from '../../model/models';
import { AlertService } from '../../services/alert.service';
import { OnInit } from '@angular/core';

@Component({
    selector: 'app-alert-configurator',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink, SidebarComponent],
    templateUrl: './alert-configurator.html',
    styleUrls: ['./alert-configurator.css']
})
export class AlertConfigurator implements OnInit {

    isSidebarOpen = false;
    alerts: AlertResponse[] = [
        {
            id: 1,
            alertName: 'Ritardo Consegna Milano',
            alertTypology: 'ORDER_DELIVERY_DELAY',
            alertDescription: 'Monitoraggio ritardi zona urbana Milano',
            alertStatus: true,
            alertCreatedDate: new Date().toISOString(),
            alertTheshold: 'PT1H'
        },
        {
            id: 2,
            alertName: 'GPS Stop Roma',
            alertTypology: 'GPS_SIGNAL_INTERRUPTED',
            alertDescription: 'Allerta per perdita segnale in galleria',
            alertStatus: false,
            alertCreatedDate: new Date().toISOString(),
            alertTheshold: 'PT30M'
        }
    ];
    isLoading = false;

    constructor(
        private router: Router,
        private alertService: AlertService
    ) { }

    ngOnInit() {
        // Proviamo comunque a caricare, ma abbiamo già i dati locali come fallback
        this.loadAlerts();
    }

    loadAlerts() {
        this.isLoading = true;
        this.alertService.getAlerts().subscribe({
            next: (data) => {
                if (data && data.length > 0) {
                    this.alerts = data;
                }
                this.isLoading = false;
            },
            error: (err) => {
                console.warn('Backend non raggiungibile, uso dati locali', err);
                this.isLoading = false;
            }
        });
    }

    isDeleteModalOpen = false;
    alertToDelete: AlertResponse | null = null;

    toggleSidebar() {
        this.isSidebarOpen = !this.isSidebarOpen;
    }

    logout() {
        this.router.navigate(['/']);
    }

    toggleStatus(alert: AlertResponse) {
        const newStatus = !alert.alertStatus;
        this.alertService.updateAlertStatus(alert.id, newStatus).subscribe({
            next: () => {
                alert.alertStatus = newStatus;
            },
            error: (err) => {
                console.error('Error updating alert status', err);
            }
        });
    }

    editAlert(alert: AlertResponse) {
        this.router.navigate(['/alert-modification', alert.id]);
    }

    openDeleteModal(alert: AlertResponse) {
        this.alertToDelete = alert;
        this.isDeleteModalOpen = true;
    }

    closeDeleteModal() {
        this.isDeleteModalOpen = false;
        this.alertToDelete = null;
    }

    confirmDelete() {
        if (this.alertToDelete) {
            this.alertService.deleteAlert(this.alertToDelete.id).subscribe({
                next: () => {
                    this.alerts = this.alerts.filter(a => a.id !== this.alertToDelete?.id);
                    this.closeDeleteModal();
                },
                error: (err) => {
                    console.error('Error deleting alert', err);
                    // Anche in caso di errore, se siamo offline cancelliamo localmente per UX
                    this.alerts = this.alerts.filter(a => a.id !== this.alertToDelete?.id);
                    this.closeDeleteModal();
                }
            });
        }
    }

    getTypologyLabel(typology: string): string {
        switch (typology) {
            case 'ORDER_DEPARTURE_DELAY': return 'Ritardo partenza ordine';
            case 'ORDER_DELIVERY_DELAY': return 'Ritardo consegna ordine';
            case 'GPS_SIGNAL_INTERRUPTED': return 'Segnale GPS interrotto';
            default: return typology;
        }
    }

    formatDuration(duration: any): string {
        if (duration === null || duration === undefined) return '00:00';

        // Se è già nel formato HH:mm
        if (typeof duration === 'string' && /^\d{2}:\d{2}$/.test(duration)) return duration;

        // Se è un numero (assumiamo secondi, formato Jackson standard per Duration)
        if (typeof duration === 'number') {
            const totalMinutes = Math.floor(duration / 60);
            const h = Math.floor(totalMinutes / 60);
            const m = totalMinutes % 60;
            return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
        }

        // Se è un oggetto {seconds, nanos}
        if (typeof duration === 'object' && 'seconds' in duration) {
            const totalMinutes = Math.floor(duration.seconds / 60);
            const h = Math.floor(totalMinutes / 60);
            const m = totalMinutes % 60;
            return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
        }

        // Se è una stringa ISO-8601 (es: PT1H30M)
        if (typeof duration === 'string' && duration.startsWith('PT')) {
            const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
            if (!match) return duration;
            const hours = (match[1] || '0').padStart(2, '0');
            const minutes = (match[2] || '0').padStart(2, '0');
            return `${hours}:${minutes}`;
        }

        return String(duration);
    }
}
