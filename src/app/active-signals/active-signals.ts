
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';

interface Signal {
    id: string; // Order ID
    alertId: string;
    description: string; // e.g., "Segnale GPS interrotto"
    time: string; // e.g., "00:30"
    type: 'gps' | 'delay' | 'other';
}

@Component({
    selector: 'app-active-signals',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    templateUrl: './active-signals.html',
    styleUrls: ['./active-signals.css']
})
export class ActiveSignals {

    isSidebarOpen = false;

    constructor(private router: Router) { }

    signals: Signal[] = [
        { id: 'AB1234', alertId: 'A0001', description: 'Segnale GPS interrotto', time: '00:30', type: 'gps' },
        { id: 'CD5678', alertId: 'A0002', description: 'Ritardo partenza ordine', time: '01:00', type: 'delay' },
        { id: 'EF9012', alertId: 'A0003', description: 'Ritardo consegna ordine', time: '02:00', type: 'delay' },
        { id: 'GH3456', alertId: 'A0004', description: 'Segnale GPS interrotto', time: '00:30', type: 'gps' }
    ];

    toggleSidebar() {
        this.isSidebarOpen = !this.isSidebarOpen;
    }

    logout() {
        this.router.navigate(['/']);
    }

    resolveSignal(signal: Signal) {
        console.log('Resolving signal:', signal);
        // Logic to resolve/remove signal
    }
}
