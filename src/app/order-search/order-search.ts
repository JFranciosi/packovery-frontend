import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Order {
    id: string;
    status: string;
    origin: string;
    destination: string;
    date: string;
    weight: string;
    size: string;
}

@Component({
    selector: 'app-order-search',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './order-search.html',
    styleUrls: ['./order-search.css']
})
export class OrderSearch {

    // Filter models
    filters = {
        orderId: '',
        status: '',
        originCity: '',
        destCity: '',
        date: '',
        weight: '',
        size: ''
    };

    // Dropdown options (mock)
    statusOptions = ['In transito', 'In attesa', 'Consegnato'];
    weightOptions = ['S (1g - 90g)', 'M (1kg - 3kg)', 'L (3kg - 5kg)', 'XL (6kg - 10kg)'];
    sizeOptions = ['S (1cm - 15cm)', 'M (16cm - 30cm)', 'L (31cm - 45cm)', 'XL (46cm - 100cm)'];

    // Data
    orders: Order[] = [
        {
            id: 'AB1234',
            status: 'In transito',
            origin: 'Legnano MI',
            destination: 'Varese VA',
            date: '12/01/2026',
            weight: 'M (1kg - 3kg)',
            size: 'M (16cm - 30cm)'
        },
        {
            id: 'CD5678',
            status: 'In transito',
            origin: 'Busto Arsizio VA',
            destination: 'Cislago VA',
            date: '13/01/2026',
            weight: 'L (3kg - 5kg)',
            size: 'L (31cm - 45cm)'
        },
        {
            id: 'EF9012',
            status: 'In attesa',
            origin: 'Varese VA',
            destination: 'Tradate VA',
            date: '21/12/2025',
            weight: 'S (1g - 90g)',
            size: 'S (1cm - 15cm)'
        },
        {
            id: 'GH3456',
            status: 'In transito',
            origin: 'Saronno VA',
            destination: 'Como CO',
            date: '13/01/2026',
            weight: 'XL (6kg - 10kg)',
            size: 'M (16cm - 30cm)' // Note: Image has M here for size, XL for weight
        }
    ];

    isStatusOpen = false;
    isWeightOpen = false;
    isSizeDropdownOpen = false;

    toggleDropdown(type: 'status' | 'weight' | 'size') {
        // Close others
        if (type !== 'status') this.isStatusOpen = false;
        if (type !== 'weight') this.isWeightOpen = false;
        if (type !== 'size') this.isSizeDropdownOpen = false;

        // Toggle current
        if (type === 'status') this.isStatusOpen = !this.isStatusOpen;
        if (type === 'weight') this.isWeightOpen = !this.isWeightOpen;
        if (type === 'size') this.isSizeDropdownOpen = !this.isSizeDropdownOpen;
    }

    selectOption(type: 'status' | 'weight' | 'size', value: string) {
        if (type === 'status') {
            this.filters.status = value;
            this.isStatusOpen = false;
        } else if (type === 'weight') {
            this.filters.weight = value;
            this.isWeightOpen = false;
        } else if (type === 'size') {
            this.filters.size = value;
            this.isSizeDropdownOpen = false;
        }
    }

    isSidebarOpen = false;

    toggleSidebar() {
        this.isSidebarOpen = !this.isSidebarOpen;
    }
}
