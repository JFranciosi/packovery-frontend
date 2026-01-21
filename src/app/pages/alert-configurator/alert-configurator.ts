import { Component, OnInit, OnDestroy, ViewChild, ElementRef, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../component/sidebar/sidebar';
import { AlertService } from '../../services/alert.service';
import { AlertResponse } from '../../model/models';

@Component({
    selector: 'app-alert-configurator',
    standalone: true,
    imports: [CommonModule, FormsModule, SidebarComponent],
    templateUrl: './alert-configurator.html',
    styleUrls: ['./alert-configurator.css']
})
export class AlertConfigurator implements OnInit, OnDestroy {
    alerts: AlertResponse[] = [];
    allAlerts: AlertResponse[] = [];
    paginatedAlerts: AlertResponse[] = [];
    isLoading = false;
    offset = 0;
    limit = 7;
    currentPage = 1;
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

    selectedTypologyLabel = '';
    selectedStatusLabel = '';
    isTypologyOpen = false;
    isStatusOpen = false;
    isDeleteModalOpen = false;
    alertToDeleteIdNum: number | null = null;

    constructor(private alertService: AlertService, private router: Router) { }

    ngOnInit() {
        this.loadAlerts();
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

    applyFilters() {
        this.offset = 0;
        this.currentPage = 1;
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
        const startIndex = this.offset;
        const endIndex = this.offset + this.limit;
        this.paginatedAlerts = this.filteredAlerts.slice(startIndex, endIndex);
    }

    nextPage() {
        if (this.offset + this.limit < this.filteredAlerts.length) {
            this.offset += this.limit;
            this.currentPage++;
            this.updateView();
        }
    }

    prevPage() {
        if (this.offset > 0) {
            this.offset -= this.limit;
            this.currentPage--;
            this.updateView();
        }
    }

    ngOnDestroy(): void {
    }

    toggleDropdown(type: 'typology' | 'status') {
        if (type === 'typology') {
            this.isStatusOpen = false;
            this.isTypologyOpen = !this.isTypologyOpen;
        } else {
            this.isTypologyOpen = false;
            this.isStatusOpen = !this.isStatusOpen;
        }
    }

    selectOption(type: 'typology' | 'status', option: { label: string, value: string }) {
        if (type === 'typology') {
            this.filters.typology = option.value;
            this.selectedTypologyLabel = option.label;
            this.isTypologyOpen = false;
        } else if (type === 'status') {
            this.filters.status = option.value;
            this.selectedStatusLabel = option.label;
            this.isStatusOpen = false;
        }
        this.applyFilters();
    }

    clearFilter(type: 'typology' | 'status' | 'global') {
        if (type === 'typology') {
            this.filters.typology = '';
            this.selectedTypologyLabel = '';
            this.isTypologyOpen = false;
        } else if (type === 'status') {
            this.filters.status = '';
            this.selectedStatusLabel = '';
            this.isStatusOpen = false;
        } else {
            this.filters.global = '';
        }
        this.applyFilters();
    }

    filter() {
        this.applyFilters();
    }

    @HostListener('document:click', ['$event'])
    clickout(event: any) {
        if (!event.target.closest('.select-wrapper')) {
            this.isTypologyOpen = false;
            this.isStatusOpen = false;
        }
    }

    toggleSidebar() {
        this.isSidebarOpen = !this.isSidebarOpen;
    }

    getTypologyLabel(value: string): string {
        const option = this.typologyOptions.find(o => o.value === value);
        return option ? option.label : value;
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
