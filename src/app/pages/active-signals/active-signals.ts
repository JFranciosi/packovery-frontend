import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SidebarComponent } from '../../component/sidebar/sidebar';
import { ResolveSignalPopup } from '../../component/resolve-signal-popup/resolve-signal-popup';
import { AlertFilterComponent } from '../../component/alert-filter/alert-filter';
import { ReportService } from '../../services/report.service';
import { AlertService } from '../../services/alert.service';
import { AuthService } from '../../services/auth.service';
import { ReportResponse } from '../../model/models';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';

@Component({
    selector: 'app-active-signals',
    standalone: true,
    imports: [CommonModule, SidebarComponent, ResolveSignalPopup, AlertFilterComponent, InfiniteScrollDirective],
    templateUrl: './active-signals.html',
    styleUrls: ['./active-signals.css']
})
export class ActiveSignals implements OnInit {

    typologyOptions = [
        { label: 'Ritardo Partenza', value: 'ORDER_DEPARTURE_DELAY' },
        { label: 'Ritardo Consegna', value: 'ORDER_DELIVERY_DELAY' },
        { label: 'Segnale GPS Interrotto', value: 'GPS_SIGNAL_INTERRUPTED' }
    ];

    filters = {
        global: '',
        typology: '',
        status: '',
        orderId: ''
    };

    allReports: ReportResponse[] = [];
    isSidebarOpen = false;
    filteredReports: ReportResponse[] = [];
    paginatedReports: ReportResponse[] = [];

    isLoading = false;
    isOffline = false;
    showResolvePopup = false;
    selectedReport: ReportResponse | null = null;

    limit = 20;

    private alertService = inject(AlertService);
    private reportService = inject(ReportService);
    private authService = inject(AuthService);
    private router = inject(Router);

    ngOnInit() {
        this.loadSavedFilters();
        this.loadSelectOptions();
        this.loadReports();
    }

    loadSelectOptions() {
        this.alertService.getSelectOptions().subscribe({
            next: (data: string[]) => {
                if (data && data.length > 0) {
                    this.typologyOptions = data.map((t: string) => ({
                        label: this.getTypologyLabel(t),
                        value: t
                    }));
                }
            },
            error: (err: any) => { }
        });
    }

    loadSavedFilters() {
        const user = this.authService.getUserEmail();
        if (user) {
            const saved = localStorage.getItem(`reportFilters_${user}`);
            if (saved) {
                try {
                    this.filters = { ...this.filters, ...JSON.parse(saved) };
                } catch (e) {
                }
            }
        }
    }

    saveFilters() {
        const user = this.authService.getUserEmail();
        if (user) {
            localStorage.setItem(`reportFilters_${user}`, JSON.stringify(this.filters));
        }
    }

    loadReports() {
        this.isLoading = true;
        this.isOffline = false;
        this.reportService.getReports().subscribe({
            next: (data) => {
                this.allReports = data.filter(r => !r.resolved);
                this.applyFilters();
                this.isLoading = false;
            },
            error: (err) => {
                if (!navigator.onLine || err.status === 0 || err.status === 504) {
                    this.isOffline = true;
                }
                this.isLoading = false;
            }
        });
    }

    onFilterChange(newFilters: any) {
        this.filters = newFilters;
        this.saveFilters();
        this.applyFilters();
    }

    applyFilters() {
        this.filteredReports = this.allReports.filter(report => {
            if (this.filters.global) {
                const search = this.filters.global.toLowerCase();
                const text = report.alertName.toLowerCase();
                if (!text.includes(search)) return false;
            }

            if (this.filters.orderId) {
                const search = this.filters.orderId.toLowerCase();
                const orderIdStr = String(report.orderId).toLowerCase();

                // Allow match if standard includes OR if numeric parts match
                // This allows finding "ORD-123" by typing "123" (standard) or "12 3" (numeric)
                // or if the ID is "12-34" and user types "1234"
                if (orderIdStr.includes(search)) return true;

                const searchNums = search.replace(/\D/g, '');
                const orderNums = orderIdStr.replace(/\D/g, '');

                if (searchNums && orderNums.includes(searchNums)) return true;

                return false;
            }

            if (this.filters.typology && report.alertTypology !== this.filters.typology) {
                return false;
            }

            return true;
        });

        this.updateView();
    }

    updateView() {
        this.limit = 20;
        this.paginatedReports = this.filteredReports.slice(0, this.limit);
    }

    onScroll() {
        if (this.limit < this.filteredReports.length) {
            const nextBatch = this.filteredReports.slice(this.limit, this.limit + 10);
            this.paginatedReports = [...this.paginatedReports, ...nextBatch];
            this.limit += 10;
        }
    }

    toggleSidebar() {
        this.isSidebarOpen = !this.isSidebarOpen;
    }

    logout() {
        this.authService.logout().subscribe();
    }

    getTypologyLabel(type: string): string {
        switch (type) {
            case 'GPS_SIGNAL_INTERRUPTED': return 'Segnale GPS Interrotto';
            case 'ORDER_DEPARTURE_DELAY': return 'Ritardo Partenza';
            case 'ORDER_DELIVERY_DELAY': return 'Ritardo Consegna';
            default: return type;
        }
    }

    getTypologyClass(type: string): string {
        switch (type) {
            case 'GPS_SIGNAL_INTERRUPTED': return 'type-gps';
            case 'ORDER_DEPARTURE_DELAY':
            case 'ORDER_DELIVERY_DELAY': return 'type-delay';
            default: return 'type-default';
        }
    }

    resolveSignal(report: ReportResponse) {
        this.selectedReport = report;
        this.showResolvePopup = true;
    }

    closeResolvePopup() {
        this.showResolvePopup = false;
        this.selectedReport = null;
    }

    confirmResolve(description: string) {
        if (!this.selectedReport) return;

        this.reportService.resolveReport(
            this.selectedReport.id,
            'RESOLVED_BY_SYSTEM_USER',
            description
        ).subscribe({
            next: () => {
                this.closeResolvePopup();
                this.loadReports();
            },
            error: (err) => {
            }
        });
    }

    formatDate(dateStr: string): string {
        try {
            const date = new Date(dateStr);
            return date.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
        } catch (e) {
            return dateStr;
        }
    }
}

