import { Component, EventEmitter, Input, Output, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-alert-filter',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './alert-filter.html',
    styleUrls: ['./alert-filter.css']
})
export class AlertFilterComponent implements OnInit {
    @Input() typologyOptions: { label: string, value: string }[] = [];
    @Input() statusOptions: { label: string, value: string }[] = [];
    @Input() showOrderId = false;
    @Input() initialFilters: { global: string, typology: string, status: string, orderId?: string } | null = null;

    @Output() filterChange = new EventEmitter<{ global: string, typology: string, status: string, orderId?: string }>();

    filters = {
        global: '',
        typology: '',
        status: '',
        orderId: ''
    };

    selectedTypologyLabel = '';
    selectedStatusLabel = '';
    isTypologyOpen = false;
    isStatusOpen = false;

    ngOnInit() {
        if (this.initialFilters) {
            this.filters = {
                global: this.initialFilters.global || '',
                typology: this.initialFilters.typology || '',
                status: this.initialFilters.status || '',
                orderId: this.initialFilters.orderId || ''
            };
            // Set initial labels
            if (this.filters.typology) {
                const opt = this.typologyOptions.find(o => o.value === this.filters.typology);
                if (opt) this.selectedTypologyLabel = opt.label;
            }
            if (this.filters.status) {
                const opt = this.statusOptions.find(o => o.value === this.filters.status);
                if (opt) this.selectedStatusLabel = opt.label;
            }
        }
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
        this.emitFilters();
    }

    clearFilter(type: 'typology' | 'status' | 'global' | 'orderId') {
        if (type === 'typology') {
            this.filters.typology = '';
            this.selectedTypologyLabel = '';
            this.isTypologyOpen = false;
        } else if (type === 'status') {
            this.filters.status = '';
            this.selectedStatusLabel = '';
            this.isStatusOpen = false;
        } else if (type === 'orderId') {
            this.filters.orderId = '';
        } else {
            this.filters.global = '';
        }
        this.emitFilters();
    }

    onGlobalSearchChange(event: Event) {
        const input = event.target as HTMLInputElement;
        this.filters.global = input.value;
        this.emitFilters();
    }

    onOrderIdChange(event: Event) {
        const input = event.target as HTMLInputElement;
        this.filters.orderId = input.value;
        this.emitFilters();
    }

    emitFilters() {
        this.filterChange.emit(this.filters);
    }

    @HostListener('document:click', ['$event'])
    clickout(event: any) {
        const target = event.target as HTMLElement;
        if (!target.closest('.select-wrapper')) {
            this.isTypologyOpen = false;
            this.isStatusOpen = false;
        }
    }
}
