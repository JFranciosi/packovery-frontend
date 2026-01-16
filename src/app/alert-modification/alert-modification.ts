
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-alert-modification',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    templateUrl: './alert-modification.html',
    styleUrls: ['./alert-modification.css']
})
export class AlertModification implements OnInit {

    isSidebarOpen = false;

    // Form Model
    alert = {
        id: '',
        type: '',
        name: '',
        description: '',
        threshold: '',
        active: false
    };

    constructor(private router: Router, private route: ActivatedRoute) { }

    ngOnInit() {
        // Get ID from route
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.loadAlert(id);
        }
    }

    loadAlert(id: string) {
        // Mock data loading
        // In real app, fetch from service
        console.log('Loading alert', id);

        // Mock data based on ID or just generic for demo
        this.alert = {
            id: 'A0001',
            type: 'Ritardo consegna ordine',
            name: 'Alert1',
            description: 'Lorem ipsum dolor sit amet consectetur. Nec sed pharetra sed cum viverra fames.',
            threshold: '00:00',
            active: true
        };
    }

    toggleSidebar() {
        this.isSidebarOpen = !this.isSidebarOpen;
    }

    logout() {
        this.router.navigate(['/']);
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

    modifyAlert() {
        console.log('Modify Alert', this.alert);
        this.router.navigate(['/alert-configurator']);
    }
}
