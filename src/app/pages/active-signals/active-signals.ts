import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SidebarComponent } from '../../component/sidebar/sidebar';
import { ReportService } from '../../services/report.service';
import { AuthService } from '../../services/auth.service';
import { ReportResponse } from '../../model/models';

@Component({
    selector: 'app-active-signals',
    standalone: true,
    imports: [CommonModule, SidebarComponent],
    templateUrl: './active-signals.html',
    styleUrls: ['./active-signals.css']
})
export class ActiveSignals implements OnInit {

    isSidebarOpen = false;
    reports: ReportResponse[] = [];
    isLoading = false;

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
        // Supponendo che 'RESOLVED' sia un valore valido del tuo enum IssueResolution nel backend
        this.reportService.resolveReport(report.id, 'RESOLVED_BY_SYSTEM_USER', 'Risolto da interfaccia operatore').subscribe({
            next: () => {
                this.loadReports(); // Refresh list
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

