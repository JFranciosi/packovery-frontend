import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../component/sidebar/sidebar';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { AlertService } from '../../services/alert.service';
import { AuthService } from '../../services/auth.service';
import { AlertResponse } from '../../model/models';
import { AlertFilterComponent } from '../../component/alert-filter/alert-filter';

@Component({
    selector: 'app-alert-configurator',
    standalone: true,
    imports: [CommonModule, SidebarComponent, AlertFilterComponent, InfiniteScrollDirective],
    templateUrl: './alert-configurator.html',
    styleUrls: ['./alert-configurator.css']
})
export class AlertConfigurator implements OnInit, OnDestroy {
    alerts: AlertResponse[] = [];
    allAlerts: AlertResponse[] = [];
    paginatedAlerts: AlertResponse[] = [];
    isLoading = false;
    limit = 20;
    isSidebarOpen = false;

    typologyOptions = [
        { label: 'Ritardo Partenza', value: 'ORDER_DEPARTURE_DELAY' },
        { label: 'Ritardo Consegna', value: 'ORDER_DELIVERY_DELAY' },
        { label: 'Segnale GPS Interrotto', value: 'GPS_SIGNAL_INTERRUPTED' }
    ];

    statusOptions = [
        { label: 'Attivo', value: 'true' },
        { label: 'Non attivo', value: 'false' }
    ];

    filters = {
        global: '',
        typology: '',
        status: ''
    };

    isDeleteModalOpen = false;
    alertToDeleteIdNum: number | null = null;

    constructor(private alertService: AlertService, private router: Router, private authService: AuthService) { }

    ngOnInit() {
        this.loadSavedFilters();
        this.loadSelectOptions();
        this.loadAlerts();
    }

    loadSelectOptions() {
        this.alertService.getSelectOptions().subscribe({
            next: (data) => {
                if (data.alertTypologies && data.alertTypologies.length > 0) {
                    this.typologyOptions = data.alertTypologies.map(t => ({
                        label: this.getTypologyLabel(t),
                        value: t
                    }));
                }
            },
            error: (err) => console.warn('Failed to load alert typology options, using defaults', err)
        });
    }

    loadSavedFilters() {
        const user = this.authService.getUserEmail();
        if (user) {
            const saved = localStorage.getItem(`alertFilters_${user}`);
            if (saved) {
                try {
                    this.filters = JSON.parse(saved);
                } catch (e) {
                    console.error('Error parsing saved alert filters', e);
                }
            }
        }
    }

    saveFilters() {
        const user = this.authService.getUserEmail();
        if (user) {
            localStorage.setItem(`alertFilters_${user}`, JSON.stringify(this.filters));
        }
    }

    loadAlerts() {
        this.isLoading = true;
        this.alertService.getAlerts().subscribe({
            next: (data) => {
                this.allAlerts = data;
                this.applyFilters();
                this.isLoading = false;
            },
            error: (err) => {
                console.error('Failed to load alerts', err);
                this.isLoading = false;
            }
        });
    }

    filteredAlerts: AlertResponse[] = [];

    onFilterChange(newFilters: { global: string, typology: string, status: string }) {
        this.filters = newFilters;
        this.saveFilters();
        this.applyFilters();
    }

    applyFilters() {
        this.filteredAlerts = this.allAlerts.filter(alert => {
            if (this.filters.global) {
                const search = this.filters.global.toLowerCase();
                const typoLabel = this.getTypologyLabel(alert.alertTypology).toLowerCase();
                const text = (alert.alertName + ' ' + alert.alertDescription + ' ' + typoLabel).toLowerCase();
                if (!text.includes(search)) return false;
            }

            if (this.filters.typology && alert.alertTypology !== this.filters.typology) {
                return false;
            }

            if (this.filters.status) {
                const isActiveStr = this.filters.status === 'true';
                if (alert.alertStatus !== isActiveStr) return false;
            }
            return true;
        });

        this.updateView();
    }

    updateView() {
        this.limit = 20;
        this.paginatedAlerts = this.filteredAlerts.slice(0, this.limit);
    }

    onScroll() {
        if (this.limit < this.filteredAlerts.length) {
            this.limit += 10;
            this.paginatedAlerts = this.filteredAlerts.slice(0, this.limit);
        }
    }

    ngOnDestroy(): void {
    }

    toggleSidebar() {
        this.isSidebarOpen = !this.isSidebarOpen;
    }

    getTypologyLabel(value: string): string {
        switch (value) {
            case 'ORDER_DEPARTURE_DELAY': return 'Ritardo Partenza';
            case 'ORDER_DELIVERY_DELAY': return 'Ritardo Consegna';
            case 'GPS_SIGNAL_INTERRUPTED': return 'Segnale GPS Interrotto';
            default: return value;
        }
    }

    formatDuration(seconds: number): string {
        if (!seconds && seconds !== 0) return '0s';
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;

        const parts = [];
        if (h > 0) parts.push(`${h}h`);
        if (m > 0) parts.push(`${m}m`);
        if (s > 0) parts.push(`${s}s`);
        return parts.length > 0 ? parts.join(' ') : '0s';
    }

    openNewAlert() {
        this.router.navigate(['/alert-creation']);
    }

    editAlert(alert: AlertResponse) {
        this.router.navigate(['/alert-modification', alert.id]);
    }

    toggleStatus(alert: AlertResponse, event: any) {
        const newStatus = event.target.checked;
        this.alertService.updateAlertStatus(alert.id, newStatus).subscribe({
            next: () => {
                alert.alertStatus = newStatus;
            },
            error: (err) => {
                console.error('Error updating alert status', err);
                event.target.checked = !newStatus;
            }
        });
    }

    confirmDelete(id: number) {
        this.alertToDeleteIdNum = id;
        this.isDeleteModalOpen = true;
    }

    deleteAlert() {
        if (this.alertToDeleteIdNum !== null) {
            this.alertService.deleteAlert(this.alertToDeleteIdNum).subscribe({
                next: () => {
                    this.cancelDelete();
                    this.loadAlerts();
                },
                error: (err) => console.error(err)
            });
        }
    }

    cancelDelete() {
        this.isDeleteModalOpen = false;
        this.alertToDeleteIdNum = null;
    }
}
