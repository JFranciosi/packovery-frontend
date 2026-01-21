import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { SidebarComponent } from '../../component/sidebar/sidebar';
import { Map } from '../../component/map/map';
import { Chat } from '../../component/chat/chat';
import { OrderService } from '../../services/order.service';
import { OrderResponse } from '../../model/models';

@Component({
    selector: 'app-order-details',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink, SidebarComponent, Map, Chat],
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
        name: 'Marco',
        surname: 'Rossi',
        estimatedArrival: '26 febbraio - 14:30',
        transport: 'Automobile'
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
        this.orderService.getFilteredOrders({ id }, 0, 1).subscribe({
            next: (orders) => {
                if (orders && orders.length > 0) {
                    this.processOrder(orders[0]);
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

    private processOrder(raw: OrderResponse) {
        this.order = {
            id: raw.id,
            creatorName: 'Utente',
            creatorSurname: 'Packovery',
            status: this.getStatusLabel(raw.status),
            creationDate: new Date(raw.plannedDeliveryTime).toLocaleDateString('it-IT'),
            weight: raw.packageWeight,
            size: raw.packageSize,
            departure: {
                address: raw.departureLocation,
                lat: 45.6120, lng: 8.8515
            },
            currentPosition: {
                coords: '45°37\'05.8"N 9°00\'41.4"E',
                lat: 45.6183, lng: 9.0115
            },
            arrival: {
                address: raw.deliveryLocation,
                lat: 45.6577, lng: 8.9733
            }
        };
        this.isLoading = false;
    }

    private useMockOrder(id: string) {
        this.order = {
            id: id,
            creatorName: 'Marco',
            creatorSurname: 'Bianchi',
            status: 'In transito',
            creationDate: '20/01/2026',
            weight: '2.5kg',
            size: 'M',
            departure: {
                address: 'Via Garibaldi 10, Busto Arsizio',
                lat: 45.6120, lng: 8.8515
            },
            currentPosition: {
                coords: '45°37\'05.8"N 9°00\'41.4"E',
                lat: 45.6183, lng: 9.0115
            },
            arrival: {
                address: 'Via Cavour 5, Cislago',
                lat: 45.6577, lng: 8.9733
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
}

