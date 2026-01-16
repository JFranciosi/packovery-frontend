
import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import * as L from 'leaflet';

@Component({
    selector: 'app-order-details',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    templateUrl: './order-details.html',
    styleUrls: ['./order-details.css']
})
export class OrderDetails implements AfterViewInit {
    private map!: L.Map;

    // Mock addresses with coords for Leaflet
    order = {
        id: 'CD5678',
        creatorName: 'Luca',
        creatorSurname: 'Rinaldi',
        status: 'In transito',
        creationDate: '13/01/2026',
        weight: 'L (3kg - 5kg)',
        size: 'L (31cm - 45cm)',
        departure: {
            address: 'Via Garibaldi 27, Busto Arsizio, 21052, VA',
            lat: 45.6120, lng: 8.8515
        },
        currentPosition: {
            coords: '45°37\'05.8"N 9°00\'41.4"E',
            lat: 45.6183, lng: 9.0115 // Approx location from DMS
        },
        arrival: {
            address: 'Via Cesare Battisti 1315, Cislago, 21040 VA',
            lat: 45.6577, lng: 8.9733
        }
    };

    rider = {
        name: 'Marco',
        surname: 'Rossi',
        estimatedArrival: '26 febbraio - 14:30',
        transport: 'Automobile'
    };

    isSidebarOpen = false;

    toggleSidebar() {
        this.isSidebarOpen = !this.isSidebarOpen;
    }

    logout() {
        // Implement logout logic here
        console.log('Logging out...');
    }

    ngAfterViewInit(): void {
        this.initMap();
    }

    private initMap(): void {
        const centerLat = 45.635;
        const centerLng = 8.91;

        this.map = L.map('map', {
            center: [centerLat, centerLng],
            zoom: 12
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(this.map);

        // Markers
        // Start
        L.marker([this.order.departure.lat, this.order.departure.lng]).addTo(this.map)
            .bindPopup('Punto di partenza: Busto Arsizio')
            .openPopup();

        // End
        L.marker([this.order.arrival.lat, this.order.arrival.lng]).addTo(this.map)
            .bindPopup('Destinazione: Cislago');

        // Current Pos (Circle)
        const circle = L.circleMarker([this.order.currentPosition.lat, this.order.currentPosition.lng], {
            color: '#5865F2',
            fillColor: '#5865F2',
            fillOpacity: 0.8,
            radius: 8
        }).addTo(this.map).bindPopup('Posizione attuale');

        // Draw Route Polyline (Linear interpolation between points)
        const routePath = [
            [this.order.departure.lat, this.order.departure.lng],
            [this.order.currentPosition.lat, this.order.currentPosition.lng],
            [this.order.arrival.lat, this.order.arrival.lng]
        ];

        const polyline = L.polyline(routePath as L.LatLngExpression[], {
            color: '#5865F2',
            weight: 4,
            opacity: 0.7,
            dashArray: '10, 10', // Optional: make dashed to suggest "planned" path or solid? Let's go solid or dashed. 
            // User said "trace path". Usually implies solid. Let's do solid. 
        });

        // Actually let's make it two segments: Passed (Solid) and Future (Dashed) for realism?
        // User said "trace the path". Use simple solid line for now.
        const routeLine = L.polyline(routePath as L.LatLngExpression[], {
            color: '#5865F2',
            weight: 4,
            opacity: 0.8
        }).addTo(this.map);

        // Fit bounds
        this.map.fitBounds(routeLine.getBounds(), { padding: [50, 50] });
    }

    // Chat Logic
    isChatOpen = false;
    newMessage = '';
    messages: { text: string, sender: 'user' | 'rider', time: string }[] = [
        { text: 'Ciao, a che ora è prevista la consegna?', sender: 'user', time: '14:05' },
        { text: 'Ciao Luca! Arriverò verso le 14:30.', sender: 'rider', time: '14:06' }
    ];

    toggleChat() {
        this.isChatOpen = !this.isChatOpen;
    }

    sendMessage() {
        if (!this.newMessage.trim()) return;

        this.messages.push({
            text: this.newMessage,
            sender: 'user',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });

        const userMsg = this.newMessage;
        this.newMessage = '';

        // Simulate Rider Response
        setTimeout(() => {
            this.messages.push({
                text: `Ricevuto: "${userMsg}". Sto arrivando!`,
                sender: 'rider',
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            });
        }, 2000);
    }
}

