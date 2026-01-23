import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SidebarComponent } from '../../component/sidebar/sidebar';
import { ResolveSignalPopup } from '../../component/resolve-signal-popup/resolve-signal-popup';
import { ReportService } from '../../services/report.service';
import { AuthService } from '../../services/auth.service';
import { ReportResponse } from '../../model/models';

@Component({
    selector: 'app-active-signals',
    standalone: true,
    imports: [CommonModule, SidebarComponent, ResolveSignalPopup],
    templateUrl: './active-signals.html',
    styleUrls: ['./active-signals.css']
})
export class ActiveSignals implements OnInit {

    isSidebarOpen = false;
    reports: ReportResponse[] = [];
    isLoading = false;
    showResolvePopup = false;
    selectedReport: ReportResponse | null = null;

    private reportService = inject(ReportService);
    private authService = inject(AuthService);
    private router = inject(Router);

    ngOnInit() {
        this.loadReports();
    }

    loadReports() {
        this.isLoading = true;
        this.reportService.getReports().subscribe({
            next: (data) => {
                this.reports = data.filter(r => !r.resolved);
                this.isLoading = false;
            },
            error: (err) => {
                console.error('Failed to load reports', err);
                this.isLoading = false;
            }
        });
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
                console.error('Failed to resolve report', err);
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

