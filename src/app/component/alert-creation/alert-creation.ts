import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { SidebarComponent } from '../../component/sidebar/sidebar';
import { AlertService } from '../../services/alert.service';

@Component({
    selector: 'app-alert-creation',
    standalone: true,
    imports: [CommonModule, RouterLink, SidebarComponent],
    templateUrl: './alert-creation.html',
    styleUrls: ['./alert-creation.css']
})
export class AlertCreation {
    isSidebarOpen = false;
    isLoading = false;
    errorMessage = '';
    isNameInvalid = false;
    isThresholdInvalid = false;

    private alertService = inject(AlertService);

    alert = {
        type: 'Ritardo consegna ordine',
        name: '',
        description: '',
        threshold: '00:00',
        active: true
    };

    alertTypes = [
        'Ritardo partenza ordine',
        'Ritardo consegna ordine',
        'Segnale GPS interrotto'
    ];

    constructor(private router: Router) { }

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
        if (this.isThresholdInvalid) {
            this.isThresholdInvalid = false;
        }
    }

    updateName(event: any) {
        this.alert.name = event.target.value;
        if (this.isNameInvalid && this.alert.name) {
            this.isNameInvalid = false;
        }
    }

    updateDescription(event: any) {
        this.alert.description = event.target.value;
    }

    updateThreshold(event: any) {
        this.alert.threshold = event.target.value;
        if (this.isThresholdInvalid) {
            this.isThresholdInvalid = false;
        }
    }

    updateActive(event: any) {
        this.alert.active = event.target.checked;
    }

    private mapTypology(type: string): string {
        switch (type) {
            case 'Ritardo partenza ordine': return 'ORDER_DEPARTURE_DELAY';
            case 'Ritardo consegna ordine': return 'ORDER_DELIVERY_DELAY';
            case 'Segnale GPS interrotto': return 'GPS_SIGNAL_INTERRUPTED';
            default: return '';
        }
    }

    createAlert() {
        this.isNameInvalid = false;
        this.isThresholdInvalid = false;
        this.errorMessage = '';

        if (!this.alert.name) {
            this.isNameInvalid = true;
            return;
        }

        const parts = this.alert.threshold.split(':');
        const minutes = (parseInt(parts[0]) || 0) * 60 + (parseInt(parts[1]) || 0);

        if (minutes < 30 || minutes % 30 !== 0) {
            this.isThresholdInvalid = true;
            // The message provided by user logic was specific, let's put it in HTML.
            return;
        }

        const request = {
            alertName: this.alert.name,
            alertTypology: this.mapTypology(this.alert.type),
            alertDescription: this.alert.description,
            alertStatus: this.alert.active,
            alertTheshold: minutes
        };

        this.isLoading = true;

        this.alertService.createAlert(request).subscribe({
            next: (response) => {
                this.isLoading = false;
                console.log('Alert creato:', response);
                this.router.navigate(['/alert-configurator']);
            },
            error: (err) => {
                this.isLoading = false;
                this.errorMessage = err.error || 'Errore durante la creazione dell\'alert';
                console.error('Errore creazione alert', err);
            }
        });
    }
}
