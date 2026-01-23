import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { SidebarComponent } from '../../component/sidebar/sidebar';
import { Map } from '../../component/map/map';
import { Chat } from '../../component/chat/chat';
import { OrderService } from '../../services/order.service';
import { OrderResponse } from '../../model/models';

@Component({
    selector: 'app-order-details',
    standalone: true,
    imports: [CommonModule, RouterLink, SidebarComponent, Map, Chat],
    templateUrl: './order-details.html',
    styleUrls: ['./order-details.css']
})
export class OrderDetails implements OnInit {
    private route = inject(ActivatedRoute);
    private orderService = inject(OrderService);

    isLoading = true;
    error = '';

    order: any = {
        departure: {},
        currentPosition: {},
        arrival: {}
    };

    rider = {
        name: '',
        surname: '',
        estimatedArrival: '',
        transport: ''
    };

    isSidebarOpen = false;
    isChatOpen = false;

    toggleSidebar() {
        this.isSidebarOpen = !this.isSidebarOpen;
    }

    toggleChat() {
        this.isChatOpen = !this.isChatOpen;
    }

    logout() {
        console.log('Logging out...');
    }

    ngOnInit() {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.fetchOrder(id);
        }
    }

    private fetchOrder(id: string) {
        this.isLoading = true;
        this.orderService.getOrderById(id).subscribe({
            next: (response) => {
                if (response && response.order) {
                    this.processOrder(response.order, response.mapGps);
                } else {
                    console.warn('Backend non trovato, uso mock per ID:', id);
                    this.useMockOrder(id);
                }
            },
            error: (err) => {
                console.warn('Backend offline, uso mock per ID:', id);
                this.useMockOrder(id);
            }
        });
    }

    private processOrder(raw: OrderResponse, mapGps?: any) {
        const formatCoords = (lat: number | null, lng: number | null): string => {
            if (lat && lng) {
                return `${lat.toFixed(3)}°N ${lng.toFixed(3)}°E`;
            }
            return '';
        };

        this.order = {
            id: raw.id,
            creatorName: raw.createdBy?.firstName || '',
            creatorSurname: raw.createdBy?.lastName || '',
            status: this.getStatusLabel(raw.status),
            creationDate: new Date(raw.plannedDeliveryTime).toLocaleDateString('it-IT'),
            weight: this.getWeightLabel(raw.packageWeight),
            size: this.getSizeLabel(raw.packageSize),
            departure: {
                address: raw.departureLocation || formatCoords(mapGps?.pickupLatitude, mapGps?.pickupLongitude) || '',
                lat: mapGps?.pickupLatitude || 0,
                lng: mapGps?.pickupLongitude || 0
            },
            currentPosition: {
                coords: mapGps?.riderLatitude && mapGps?.riderLongitude
                    ? formatCoords(mapGps.riderLatitude, mapGps.riderLongitude)
                    : '',
                lat: mapGps?.riderLatitude || 0,
                lng: mapGps?.riderLongitude || 0
            },
            arrival: {
                address: raw.deliveryLocation || formatCoords(mapGps?.deliveryLatitude, mapGps?.deliveryLongitude) || '',
                lat: mapGps?.deliveryLatitude || 0,
                lng: mapGps?.deliveryLongitude || 0
            }
        };
        this.isLoading = false;
    }

    private useMockOrder(id: string) {
        this.order = {
            id: id,
            creatorName: '',
            creatorSurname: '',
            status: '',
            creationDate: '',
            weight: '',
            size: '',
            departure: {
                address: '',
                lat: 0, lng: 0
            },
            currentPosition: {
                coords: '',
                lat: 0, lng: 0
            },
            arrival: {
                address: '',
                lat: 0, lng: 0
            }
        };
        this.isLoading = false;
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

