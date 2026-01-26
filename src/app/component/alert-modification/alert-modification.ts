import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { SidebarComponent } from '../../component/sidebar/sidebar';
import { AlertService } from '../../services/alert.service';
import { AlertRequest } from '../../model/models';

@Component({
    selector: 'app-alert-modification',
    standalone: true,
    imports: [CommonModule, RouterLink, SidebarComponent],
    templateUrl: './alert-modification.html',
    styleUrls: ['./alert-modification.css']
})
export class AlertModification implements OnInit {

    isSidebarOpen = false;
    isLoading = false;
    errorMessage = '';

    alert = {
        id: 0,
        type: '',
        name: '',
        description: '',
        threshold: '00:00',
        active: false
    };

    alertTypes = [
        'Ritardo partenza ordine',
        'Ritardo consegna ordine',
        'Segnale GPS interrotto'
    ];

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private alertService: AlertService
    ) { }

    ngOnInit() {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.loadAlert(parseInt(id));
        }
    }

    loadAlert(id: number) {
        this.isLoading = true;
        this.alertService.getAlertById(id).subscribe({
            next: (data) => {
                if (data) {
                    this.alert = {
                        id: data.id,
                        type: this.reverseMapTypology(data.alertTypology),
                        name: data.alertName,
                        description: data.alertDescription,
                        threshold: this.formatDuration(data.alertTheshold),
                        active: data.alertStatus
                    };
                }
                this.isLoading = false;
            },
            error: (err) => {
                this.alert = {
                    id: id,
                    type: 'Ritardo consegna ordine',
                    name: 'Alert Esempio (Locale)',
                    description: 'Dati temporanei visibili perché il backend è offline.',
                    threshold: '01:30',
                    active: true
                };
                this.isLoading = false;
            }
        });
    }

    private reverseMapTypology(typology: string): string {
        switch (typology) {
            case 'ORDER_DEPARTURE_DELAY': return 'Ritardo partenza ordine';
            case 'ORDER_DELIVERY_DELAY': return 'Ritardo consegna ordine';
            case 'GPS_SIGNAL_INTERRUPTED': return 'Segnale GPS interrotto';
            default: return typology;
        }
    }

    private mapTypology(type: string): string {
        switch (type) {
            case 'Ritardo partenza ordine': return 'ORDER_DEPARTURE_DELAY';
            case 'Ritardo consegna ordine': return 'ORDER_DELIVERY_DELAY';
            case 'Segnale GPS interrotto': return 'GPS_SIGNAL_INTERRUPTED';
            default: return '';
        }
    }

    private formatDuration(duration: any): string {
        if (duration === null || duration === undefined) return '00:00';
        if (typeof duration === 'string' && /^\d{2}:\d{2}$/.test(duration)) return duration;

        if (typeof duration === 'number') {
            const totalMinutes = Math.floor(duration / 60);
            const h = Math.floor(totalMinutes / 60);
            const m = totalMinutes % 60;
            return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
        }

        if (typeof duration === 'object' && 'seconds' in duration) {
            const totalMinutes = Math.floor(duration.seconds / 60);
            const h = Math.floor(totalMinutes / 60);
            const m = totalMinutes % 60;
            return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
        }

        if (typeof duration === 'string' && duration.startsWith('PT')) {
            const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
            if (!match) return duration;
            const hours = (match[1] || '0').padStart(2, '0');
            const minutes = (match[2] || '0').padStart(2, '0');
            return `${hours}:${minutes}`;
        }

        return String(duration);
    }

    toggleSidebar() {
        this.isSidebarOpen = !this.isSidebarOpen;
    }

    logout() {
        this.router.navigate(['/']);
    }

    selectType(type: string) {
        this.alert.type = type;
    }

    addTime(hours: number) {
        if (!this.alert.threshold) this.alert.threshold = '00:00';

        const parts = this.alert.threshold.split(':');
        let h = parseInt(parts[0]) || 0;
        let m = parseInt(parts[1]) || 0;

        let totalMinutes = h * 60 + m;
        totalMinutes += hours * 60;

        h = Math.floor(totalMinutes / 60);
        m = Math.round(totalMinutes % 60);

        const hStr = h < 10 ? '0' + h : '' + h;
        const mStr = m < 10 ? '0' + m : '' + m;

        this.alert.threshold = `${hStr}:${mStr}`;
    }

    updateThreshold(event: any) {
        this.alert.threshold = event.target.value;
    }

    updateActive(event: any) {
        this.alert.active = event.target.checked;
    }

    modifyAlert() {
        const parts = this.alert.threshold.split(':');
        const minutes = (parseInt(parts[0]) || 0) * 60 + (parseInt(parts[1]) || 0);

        if (minutes < 30 || minutes % 30 !== 0) {
            this.errorMessage = 'La soglia deve essere di almeno 30 minuti e multipli di 30';
            return;
        }

        const request: AlertRequest = {
            alertName: this.alert.name,
            alertTypology: this.mapTypology(this.alert.type),
            alertDescription: this.alert.description,
            alertStatus: this.alert.active,
            alertTheshold: minutes
        };

        this.isLoading = true;
        this.alertService.updateAlert(this.alert.id, request).subscribe({
            next: () => {
                this.isLoading = false;
                this.router.navigate(['/alert-configurator']);
            },
            error: (err) => {
                this.isLoading = false;
                this.errorMessage = err.error || 'Errore durante la modifica dell\'alert';
            }
        });
    }
}
