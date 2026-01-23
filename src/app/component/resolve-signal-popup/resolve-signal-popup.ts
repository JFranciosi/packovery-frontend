import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReportResponse } from '../../model/models';

@Component({
    selector: 'app-resolve-signal-popup',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './resolve-signal-popup.html',
    styleUrls: ['./resolve-signal-popup.css']
})
export class ResolveSignalPopup {
    @Input() report: ReportResponse | null = null;
    @Output() close = new EventEmitter<void>();
    @Output() confirm = new EventEmitter<string>();

    resolutionDescription = '';

    private sanitizeInput(input: string): string {
        if (!input) return '';
        let sanitized = input.replace(/<[^>]*>/g, '');
        sanitized = sanitized.replace(/[;'"\\]/g, '');
        return sanitized.trim().substring(0, 500);
    }

    closePopup() {
        this.resolutionDescription = '';
        this.close.emit();
    }

    confirmResolve() {
        const sanitizedDescription = this.sanitizeInput(this.resolutionDescription);
        const description = sanitizedDescription || 'Risolto da interfaccia operatore';
        this.confirm.emit(description);
        this.resolutionDescription = '';
    }

    getTypologyLabel(type: string): string {
        switch (type) {
            case 'GPS_SIGNAL_INTERRUPTED': return 'Segnale GPS Interrotto';
            case 'ORDER_DEPARTURE_DELAY': return 'Ritardo Partenza';
            case 'ORDER_DELIVERY_DELAY': return 'Ritardo Consegna';
            default: return type;
        }
    }
}
