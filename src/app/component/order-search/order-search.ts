import { Component, HostListener, ElementRef, inject, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar';

import { LocationsService } from '../../services/locations.service';
import { OrderService } from '../../services/order.service';
import { OrderResponse, Comune, FilterOrderRequest } from '../../model/models';

@Component({
    selector: 'app-order-search',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink, SidebarComponent, DatePipe],
    templateUrl: './order-search.html',
    styleUrls: ['./order-search.css']
})
export class OrderSearch implements OnInit {
    private router = inject(Router);
    private eRef = inject(ElementRef);
    private locationsService = inject(LocationsService);
    private orderService = inject(OrderService);

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

    initialFilters = { ...this.filters };

    // Dropdown options
    statusOptions = [
        { label: 'In transito', value: 'SHIPPED' },
        { label: 'In attesa', value: 'PENDING' },
        { label: 'Consegnato', value: 'DELIVERED' },
        { label: 'Cancellato', value: 'CANCELLED' },
        { label: 'Reso', value: 'RETURNED' }
    ];

    weightOptions = [
        { label: 'S (1g - 90g)', value: 'S' },
        { label: 'M (1kg - 3kg)', value: 'M' },
        { label: 'L (3kg - 5kg)', value: 'L' },
        { label: 'XL (6kg - 10kg)', value: 'XL' }
    ];

    sizeOptions = [
        { label: 'S (1cm - 15cm)', value: 'S' },
        { label: 'M (16cm - 30cm)', value: 'M' },
        { label: 'L (31cm - 45cm)', value: 'L' },
        { label: 'XL (46cm - 100cm)', value: 'XL' }
    ];

    // Autocomplete data
    filteredOriginCities: Comune[] = [];
    filteredDestCities: Comune[] = [];
    isOriginCityOpen = false;
    isDestCityOpen = false;

    // Data
    orders: OrderResponse[] = [];

    isStatusOpen = false;
    isWeightOpen = false;
    isSizeDropdownOpen = false;

    // Selected labels for display
    selectedStatusLabel = '';
    selectedWeightLabel = '';
    selectedSizeLabel = '';

    // Pagination properties
    offset = 0;
    limit = 6;
    currentPage = 1;
    hasMoreOrders = true; // To track if there are more orders to load

    ngOnInit() {
        this.clearFilters();
    }

    searchOrders() {
        this.offset = 0;
        this.currentPage = 1;
        this.loadOrders();
    }

    loadOrders() {
        const hasFilters = this.filters.orderId ||
            this.filters.status ||
            this.filters.originCity ||
            this.filters.destCity ||
            this.filters.date ||
            this.filters.weight ||
            this.filters.size;

        if (!hasFilters) {
            this.orderService.getOrders(this.offset, this.limit).subscribe({
                next: (data) => {
                    this.orders = data;
                    this.hasMoreOrders = data.length === this.limit;
                },
                error: (err) => {
                    console.error('Error fetching orders', err);
                }
            });
            return;
        }

        const request: FilterOrderRequest = {
            id: this.filters.orderId ? this.filters.orderId.toUpperCase() : undefined,
            status: this.filters.status || undefined,
            departureLocation: this.filters.originCity || undefined,
            deliveryLocation: this.filters.destCity || undefined,
            orderCreationDate: this.filters.date ? new Date(this.filters.date).toISOString() : undefined,
            weight: this.filters.weight || undefined,
            size: this.filters.size || undefined
        };

        // If date is simple "YYYY-MM-DD", LocalDateTime parser might fail if it expects "YYYY-MM-DDTHH:MM:SS".
        // Let's ensure if date is present, we send it in a compatible format. 
        // Backend `getFilteredOrders` uses `LocalDateTime`.
        // If input type=date gives "2026-01-20", appending "T00:00:00" helps.
        if (this.filters.date) {
            request.orderCreationDate = this.filters.date + 'T00:00:00';
        }

        this.orderService.getFilteredOrders(request, this.offset, this.limit).subscribe({
            next: (data) => {
                this.orders = data;
            },
            error: (err) => {
                console.error('Error fetching orders', err);
                // Handle error
            }
        });
    }

    nextPage() {
        if (this.orders.length < this.limit) return;

        this.offset++;
        this.currentPage++;
        this.loadOrders();
    }

    prevPage() {
        if (this.offset > 0) {
            this.offset--;
            this.currentPage--;
            this.loadOrders();
        }
    }

    toggleDropdown(type: 'status' | 'weight' | 'size') {
        // Close others
        if (type !== 'status') this.isStatusOpen = false;
        if (type !== 'weight') this.isWeightOpen = false;
        if (type !== 'size') this.isSizeDropdownOpen = false;

        // Close city dropdowns
        this.isOriginCityOpen = false;
        this.isDestCityOpen = false;

        // Toggle current
        if (type === 'status') this.isStatusOpen = !this.isStatusOpen;
        if (type === 'weight') this.isWeightOpen = !this.isWeightOpen;
        if (type === 'size') this.isSizeDropdownOpen = !this.isSizeDropdownOpen;
    }

    selectOption(type: 'status' | 'weight' | 'size', option: { label: string, value: string }) {
        if (type === 'status') {
            this.filters.status = option.value;
            this.selectedStatusLabel = option.label;
            this.isStatusOpen = false;
        } else if (type === 'weight') {
            this.filters.weight = option.value;
            this.selectedWeightLabel = option.label;
            this.isWeightOpen = false;
        } else if (type === 'size') {
            this.filters.size = option.value;
            this.selectedSizeLabel = option.label;
            this.isSizeDropdownOpen = false;
        }
    }

    onOriginCityInput(event: any) {
        const value = event.target.value;
        this.filters.originCity = value;
        if (value.length >= 2) {
            this.locationsService.searchComuni(value).subscribe(cities => {
                this.filteredOriginCities = cities;
                this.isOriginCityOpen = true;
            });
        } else {
            this.filteredOriginCities = [];
            this.isOriginCityOpen = false;
        }
    }

    selectOriginCity(city: Comune) {
        this.filters.originCity = `${city.nome} ${city.sigla}`;
        this.isOriginCityOpen = false;
    }

    onDestCityInput(event: any) {
        const value = event.target.value;
        this.filters.destCity = value;
        if (value.length >= 2) {
            this.locationsService.searchComuni(value).subscribe(cities => {
                this.filteredDestCities = cities;
                this.isDestCityOpen = true;
            });
        } else {
            this.filteredDestCities = [];
            this.isDestCityOpen = false;
        }
    }

    selectDestCity(city: Comune) {
        this.filters.destCity = `${city.nome} ${city.sigla}`;
        this.isDestCityOpen = false;
    }

    isSidebarOpen = false;

    toggleSidebar() {
        this.isSidebarOpen = !this.isSidebarOpen;
    }

    clearFilters() {
        this.filters = { ...this.initialFilters };
        this.selectedStatusLabel = '';
        this.selectedWeightLabel = '';
        this.selectedSizeLabel = '';
        this.searchOrders();
    }

    logout() {
        // Here you would typically clear session/tokens
        this.router.navigate(['/']);
    }

    @HostListener('document:click')
    clickout() {
        this.isStatusOpen = false;
        this.isWeightOpen = false;
        this.isSizeDropdownOpen = false;
        this.isOriginCityOpen = false;
        this.isDestCityOpen = false;
    }
    getStatusLabel(status: string): string {
        switch (status) {
            case 'PENDING': return 'In attesa';
            case 'SHIPPED': return 'In transito';
            case 'DELIVERED': return 'Consegnato';
            case 'CANCELLED': return 'Cancellato';
            case 'RETURNED': return 'Reso';
            default: return status;
        }
    }
}
