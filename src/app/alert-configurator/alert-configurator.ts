
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';

interface Alert {
    id: string;
    name: string;
    createdDate: string;
    type: string;
    threshold: string;
    status: 'Attivo' | 'Non attivo';
}

@Component({
    selector: 'app-alert-configurator',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    templateUrl: './alert-configurator.html',
    styleUrls: ['./alert-configurator.css']
})
export class AlertConfigurator {

    isSidebarOpen = false;

    constructor(private router: Router) { }

    alerts: Alert[] = [
        { id: '1', name: 'Alert1', createdDate: '18/12/2025', type: 'Ritardo consegna ordine', threshold: '01:00', status: 'Attivo' },
        { id: '2', name: 'Alert2', createdDate: '22/12/2025', type: 'Ritardo partenza ordine', threshold: '02:00', status: 'Non attivo' },
        { id: '3', name: 'Alert3', createdDate: '06/01/2026', type: 'Segnale GPS interrotto', threshold: '00:30', status: 'Attivo' }
    ];

    toggleSidebar() {
        this.isSidebarOpen = !this.isSidebarOpen;
    }

    logout() {
        this.router.navigate(['/']);
    }

    toggleStatus(alert: Alert) {
        alert.status = alert.status === 'Attivo' ? 'Non attivo' : 'Attivo';
    }

    editAlert(alert: Alert) {
        this.router.navigate(['/alert-modification', alert.id]);
    }

    deleteAlert(alert: Alert) {
        console.log('Delete', alert);
        this.alerts = this.alerts.filter(a => a.id !== alert.id);
    }
}
