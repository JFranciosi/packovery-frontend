import { Component, EventEmitter, Input, Output, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-alert-filter',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './alert-filter.html',
    styleUrls: ['./alert-filter.css']
})
export class AlertFilterComponent {
    @Input() typologyOptions: { label: string, value: string }[] = [];
    @Input() statusOptions: { label: string, value: string }[] = [];

    @Output() filterChange = new EventEmitter<{ global: string, typology: string, status: string }>();

    filters = {
        global: '',
        typology: '',
        status: ''
    };

    selectedTypologyLabel = '';
    selectedStatusLabel = '';
    isTypologyOpen = false;
    isStatusOpen = false;

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
        this.emitFilters();
    }

    onGlobalSearchChange(event: Event) {
        const input = event.target as HTMLInputElement;
        this.filters.global = input.value;
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
