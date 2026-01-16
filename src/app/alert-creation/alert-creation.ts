
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';

@Component({
    selector: 'app-alert-creation',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    templateUrl: './alert-creation.html',
    styleUrls: ['./alert-creation.css']
})
export class AlertCreation {

    isSidebarOpen = false;

    // Form Model
    alert = {
        type: 'Ritardo consegna ordine', // Default selected? verify with user or image. Image shows 'Ritardo consegna ordine' active.
        name: 'Alert1',
        description: 'Lorem ipsum dolor sit amet consectetur. Nec sed pharetra sed cum viverra fames.',
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

        // Convert to total minutes
        let totalMinutes = h * 60 + m;

        // Add requested time
        totalMinutes += hours * 60;

        // Convert back to HH:mm
        h = Math.floor(totalMinutes / 60);
        m = Math.round(totalMinutes % 60);

        // Format
        const hStr = h < 10 ? '0' + h : '' + h;
        const mStr = m < 10 ? '0' + m : '' + m;

        this.alert.threshold = `${hStr}:${mStr}`;
    }

    createAlert() {
        console.log('Create Alert', this.alert);
        // In a real app, save and navigate back
        this.router.navigate(['/alert-configurator']);
    }
}
