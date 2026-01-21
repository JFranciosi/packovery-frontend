import { Component, AfterViewInit, Input, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';

@Component({
    selector: 'app-map',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './map.html',
    styleUrls: ['./map.css']
})
export class Map implements AfterViewInit, OnDestroy {
    @Input() departure: any;
    @Input() arrival: any;
    @Input() currentPosition: any;

    private map!: L.Map;

    ngAfterViewInit(): void {
        if (this.departure && this.arrival && this.currentPosition) {
            setTimeout(() => this.initMap(), 100);
        }
    }

    ngOnDestroy(): void {
        if (this.map) {
            this.map.remove();
        }
    }

    private initMap(): void {
        if (this.map) return;

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

        if (this.departure && this.departure.lat) {
            L.marker([this.departure.lat, this.departure.lng]).addTo(this.map)
                .bindPopup(`Punto di partenza: ${this.departure.address || ''}`)
                .openPopup();
        }

        if (this.arrival && this.arrival.lat) {
            L.marker([this.arrival.lat, this.arrival.lng]).addTo(this.map)
                .bindPopup(`Destinazione: ${this.arrival.address || ''}`);
        }

        if (this.currentPosition && this.currentPosition.lat) {
            L.circleMarker([this.currentPosition.lat, this.currentPosition.lng], {
                color: '#5865F2',
                fillColor: '#5865F2',
                fillOpacity: 0.8,
                radius: 8
            }).addTo(this.map).bindPopup('Posizione attuale');
        }

        if (this.departure && this.departure.lat && this.arrival && this.arrival.lat) {
            this.getRoute(this.departure.lat, this.departure.lng, this.arrival.lat, this.arrival.lng);
        }
    }

    private getRoute(startLat: number, startLng: number, endLat: number, endLng: number) {
        const url = `https://router.project-osrm.org/route/v1/driving/${startLng},${startLat};${endLng},${endLat}?overview=full&geometries=geojson`;

        fetch(url)
            .then(res => res.json())
            .then(data => {
                if (data.routes && data.routes.length > 0) {
                    const route = data.routes[0];
                    const geojson = {
                        type: 'Feature',
                        properties: {},
                        geometry: route.geometry
                    };

                    const routeLayer = L.geoJSON(geojson as any, {
                        style: {
                            color: '#5865F2',
                            weight: 5,
                            opacity: 0.8
                        }
                    }).addTo(this.map);

                    this.map.fitBounds(routeLayer.getBounds(), { padding: [50, 50] });
                }
            })
            .catch(err => console.error('Error fetching route from OSRM:', err));
    }
}