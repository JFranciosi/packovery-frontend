import { Component, HostListener, ElementRef, inject, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { SidebarComponent } from '../../component/sidebar/sidebar';
import { LocationsService } from '../../services/locations.service';
import { OrderService } from '../../services/order.service';
import { OrderResponse, Comune, FilterOrderRequest } from '../../model/models';
import { AuthService } from '../../services/auth.service';
import { DatePickerComponent } from '../../component/date-picker/date-picker';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';

@Component({
    selector: 'app-order-search',
    standalone: true,
    imports: [CommonModule, RouterLink, SidebarComponent, DatePipe, DatePickerComponent, InfiniteScrollDirective],
    templateUrl: './order-search.html',
    styleUrls: ['./order-search.css']
})
export class OrderSearch implements OnInit {
    private router = inject(Router);
    private eRef = inject(ElementRef);
    private locationsService = inject(LocationsService);
    private orderService = inject(OrderService);
    private authService = inject(AuthService);

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

    statusOptions: { label: string, value: string }[] = [];
    weightOptions: { label: string, value: string }[] = [];
    sizeOptions: { label: string, value: string }[] = [];

    readonly defaultStatusOptions = [
        { label: 'In transito', value: 'SHIPPED' },
        { label: 'In attesa', value: 'PENDING' },
        { label: 'Consegnato', value: 'DELIVERED' },
        { label: 'Cancellato', value: 'CANCELLED' },
        { label: 'Reso', value: 'RETURNED' }
    ];

    readonly defaultWeightOptions = [
        { label: 'S (1g - 90g)', value: 'S' },
        { label: 'M (1kg - 3kg)', value: 'M' },
        { label: 'L (3kg - 5kg)', value: 'L' },
        { label: 'XL (6kg - 10kg)', value: 'XL' }
    ];

    readonly defaultSizeOptions = [
        { label: 'S (1cm - 15cm)', value: 'S' },
        { label: 'M (16cm - 30cm)', value: 'M' },
        { label: 'L (31cm - 45cm)', value: 'L' },
        { label: 'XL (46cm - 100cm)', value: 'XL' }
    ];

    filteredOriginCities: Comune[] = [];
    filteredDestCities: Comune[] = [];
    isOriginCityOpen = false;
    isDestCityOpen = false;

    orders: OrderResponse[] = [];

    isStatusOpen = false;
    isWeightOpen = false;
    isSizeDropdownOpen = false;

    selectedStatusLabel = '';
    selectedWeightLabel = '';
    selectedSizeLabel = '';

    offset = 0;
    limit = 20;
    currentPage = 1;
    hasMoreOrders = true;
    isLoading = false;

    ngOnInit() {
        this.loadSelectOptions();
        this.loadSavedFilters();
    }

    loadSavedFilters() {
        const user = this.authService.getUserEmail();
        if (user) {
            console.log('Loading filters for user:', user);
            const saved = localStorage.getItem(`orderFilters_${user}`);
            if (saved) {
                try {
                    const parsedFilters = JSON.parse(saved);
                    this.filters = { ...this.initialFilters, ...parsedFilters };

                    if (this.filters.status) {
                        this.selectedStatusLabel = this.getStatusLabel(this.filters.status);
                    }
                    if (this.filters.weight) {
                        const opt = this.weightOptions.find(o => o.value === this.filters.weight);
                        if (opt) this.selectedWeightLabel = opt.label;
                    }
                    if (this.filters.size) {
                        const opt = this.sizeOptions.find(o => o.value === this.filters.size);
                        if (opt) this.selectedSizeLabel = opt.label;
                    }

                    this.searchOrders();
                    return;
                } catch (e) {
                    console.error('Error loading saved filters', e);
                }
            }
        }
        this.clearFilters();
    }

    saveFilters() {
        const user = this.authService.getUserEmail();
        if (user) {
            localStorage.setItem(`orderFilters_${user}`, JSON.stringify(this.filters));
        }
    }

    loadSelectOptions() {
        this.orderService.getSelectOptions().subscribe({
            next: (data) => {
                if (data.orderStatuses && data.orderStatuses.length > 0) {
                    this.statusOptions = data.orderStatuses.map(status => ({
                        label: this.getStatusLabel(status),
                        value: status
                    }));
                } else {
                    this.statusOptions = this.defaultStatusOptions;
                }

                if (data.packageScales && data.packageScales.length > 0) {
                    this.weightOptions = data.packageScales.map(scale => ({
                        label: this.getWeightLabel(scale),
                        value: scale
                    }));
                    this.sizeOptions = data.packageScales.map(scale => ({
                        label: this.getSizeLabel(scale),
                        value: scale
                    }));
                } else {
                    this.weightOptions = this.defaultWeightOptions;
                    this.sizeOptions = this.defaultSizeOptions;
                }

                if (this.filters.status) {
                    this.selectedStatusLabel = this.getStatusLabel(this.filters.status);
                }
                if (this.filters.weight) {
                    const opt = this.weightOptions.find(o => o.value === this.filters.weight);
                    if (opt) this.selectedWeightLabel = opt.label;
                }
                if (this.filters.size) {
                    const opt = this.sizeOptions.find(o => o.value === this.filters.size);
                    if (opt) this.selectedSizeLabel = opt.label;
                }
            },
            error: (err) => {
                console.warn('Failed to load select options, using defaults', err);
                this.statusOptions = this.defaultStatusOptions;
                this.weightOptions = this.defaultWeightOptions;
                this.sizeOptions = this.defaultSizeOptions;

                if (this.filters.weight) {
                    const opt = this.weightOptions.find(o => o.value === this.filters.weight);
                    if (opt) this.selectedWeightLabel = opt.label;
                }
                if (this.filters.size) {
                    const opt = this.sizeOptions.find(o => o.value === this.filters.size);
                    if (opt) this.selectedSizeLabel = opt.label;
                }
            }
        });
    }

    searchOrders() {
        console.log('Searching orders with filters:', this.filters);
        this.saveFilters();
        this.offset = 0;
        this.currentPage = 1;
        this.orders = []; // Reset orders on new search
        this.loadOrders();
    }

    loadOrders() {
        if (this.isLoading) return;
        this.isLoading = true;

        const hasFilters = Object.values(this.filters).some(v => v !== '');

        if (!hasFilters) {
            this.orderService.getOrders(this.offset, this.limit).subscribe({
                next: (data) => {
                    if (data && data.length > 0) {
                        this.orders = [...this.orders, ...data];
                        this.hasMoreOrders = data.length === this.limit;
                    } else {
                        this.hasMoreOrders = false;
                    }
                    this.isLoading = false;
                },
                error: (err) => {
                    console.error('Error loading orders:', err);
                    this.hasMoreOrders = false;
                    this.isLoading = false;
                }
            });
            return;
        }

        const request: FilterOrderRequest = {};

        if (this.filters.orderId) request.id = this.filters.orderId;
        if (this.filters.status) request.status = this.filters.status;
        if (this.filters.originCity) request.departureLocation = this.filters.originCity;
        if (this.filters.destCity) request.deliveryLocation = this.filters.destCity;
        if (this.filters.weight) request.weight = this.filters.weight;
        if (this.filters.size) request.size = this.filters.size;

        if (this.filters.date) {
            request.orderCreationDate = `${this.filters.date}T00:00:00`;
        }

        this.orderService.getFilteredOrders(request, this.offset, this.limit).subscribe({
            next: (data) => {
                if (data && data.length > 0) {
                    this.orders = [...this.orders, ...data];
                    this.hasMoreOrders = data.length === this.limit;
                } else {
                    this.hasMoreOrders = false;
                }
                this.isLoading = false;
            },
            error: (err) => {
                console.error('Error filtering orders:', err);
                this.hasMoreOrders = false;
                this.isLoading = false;
            }
        });
    }

    onScroll() {
        if (this.hasMoreOrders && !this.isLoading) {
            this.offset += this.limit;
            this.currentPage++;
            this.loadOrders();
        }
    }

    toggleDropdown(type: 'status' | 'weight' | 'size') {
        if (type !== 'status') this.isStatusOpen = false;
        if (type !== 'weight') this.isWeightOpen = false;
        if (type !== 'size') this.isSizeDropdownOpen = false;
        this.isOriginCityOpen = false;
        this.isDestCityOpen = false;

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

    onOrderIdInput(event: any) {
        this.filters.orderId = event.target.value;
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
        this.filters.originCity = city.nome;
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
        this.filters.destCity = city.nome;
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
        this.saveFilters();
        this.searchOrders();
    }

    logout() {
        this.authService.logout().subscribe();
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

    getWeightLabel(scale: string): string {
        switch (scale) {
            case 'S': return 'S (1g - 90g)';
            case 'M': return 'M (1kg - 3kg)';
            case 'L': return 'L (3kg - 5kg)';
            case 'XL': return 'XL (6kg - 10kg)';
            default: return scale;
        }
    }

    getSizeLabel(scale: string): string {
        switch (scale) {
            case 'S': return 'S (1cm - 15cm)';
            case 'M': return 'M (16cm - 30cm)';
            case 'L': return 'L (31cm - 45cm)';
            case 'XL': return 'XL (46cm - 100cm)';
            default: return scale;
        }
    }
}
