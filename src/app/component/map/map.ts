import { Component, AfterViewInit, Input, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';

@Component({
    selector: 'app-map',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './map.html',
    styleUrls: ['./map.css']
})
export class Map implements AfterViewInit, OnDestroy, OnChanges {
    @Input() departure: any;
    @Input() arrival: any;
    @Input() currentPosition: any;

    isFullscreen = false;

    private map!: L.Map;
    private markers: L.Layer[] = [];

    ngAfterViewInit(): void {
        this.fixLeafletIcons();
        // Try to init if data is already available
        if (this.isValidLocation(this.departure) || this.isValidLocation(this.arrival)) {
            setTimeout(() => this.initMap(), 100);
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['departure'] || changes['arrival'] || changes['currentPosition']) {
            if (this.map) {
                this.updateMapContent();
            } else {
                if (this.isValidLocation(this.departure) || this.isValidLocation(this.arrival)) {
                    setTimeout(() => this.initMap(), 100);
                }
            }
        }
    }

    private isValidLocation(loc: any): boolean {
        return loc && typeof loc.lat === 'number' && typeof loc.lng === 'number';
    }

    ngOnDestroy(): void {
        if (this.map) {
            this.map.remove();
        }
    }

    toggleFullscreen() {
        this.isFullscreen = !this.isFullscreen;
        setTimeout(() => {
            if (this.map) {
                this.map.invalidateSize();
                if (this.isFullscreen) {
                    this.fitBoundsIfRouteExists();
                }
            }
        }, 300);
    }

    private fixLeafletIcons() {
        const iconRetinaUrl = 'assets/marker-icon-2x.png';
        const iconUrl = 'assets/marker-icon.png';
        const shadowUrl = 'assets/marker-shadow.png';
        const DefaultIcon = L.icon({
            iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
            iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
        });

        L.Marker.prototype.options.icon = DefaultIcon;
    }

    private initMap(): void {
        if (this.map) return;

        let centerLat = 45.635;
        let centerLng = 8.91;

        if (this.isValidLocation(this.departure)) {
            centerLat = this.departure.lat;
            centerLng = this.departure.lng;
        } else if (this.isValidLocation(this.arrival)) {
            centerLat = this.arrival.lat;
            centerLng = this.arrival.lng;
        }

        this.map = L.map('map', {
            center: [centerLat, centerLng],
            zoom: 12
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(this.map);

        this.updateMapContent();
    }

    private updateMapContent() {
        if (!this.map) return;

        this.markers.forEach(layer => this.map.removeLayer(layer));
        this.markers = [];
        if (this.routeLayer) {
            this.map.removeLayer(this.routeLayer);
            this.routeLayer = null;
        }

        const escapeHtml = (text: string) => {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        };

        if (this.isValidLocation(this.departure)) {
            const m = L.marker([this.departure.lat, this.departure.lng]).addTo(this.map)
                .bindPopup(`Punto di partenza: ${escapeHtml(this.departure.address || '')}`);
            this.markers.push(m);
        }

        if (this.isValidLocation(this.arrival)) {
            const m = L.marker([this.arrival.lat, this.arrival.lng]).addTo(this.map)
                .bindPopup(`Destinazione: ${escapeHtml(this.arrival.address || '')}`);
            this.markers.push(m);
        }

        if (this.isValidLocation(this.currentPosition)) {
            const m = L.circleMarker([this.currentPosition.lat, this.currentPosition.lng], {
                color: '#5865F2',
                fillColor: '#5865F2',
                fillOpacity: 0.8,
                radius: 8
            }).addTo(this.map).bindPopup('Posizione attuale');
            this.markers.push(m);
        }

        if (this.isValidLocation(this.departure) && this.isValidLocation(this.arrival)) {
            this.getRoute(this.departure.lat, this.departure.lng, this.arrival.lat, this.arrival.lng);
        } else if (this.markers.length > 0) {
            const group = L.featureGroup(this.markers as any);
            this.map.fitBounds(group.getBounds(), { padding: [50, 50] });
        }
    }

    private routeLayer: L.GeoJSON | null = null;

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

                    this.routeLayer = L.geoJSON(geojson as any, {
                        style: {
                            color: '#5865F2',
                            weight: 5,
                            opacity: 0.8
                        }
                    }).addTo(this.map);

                    this.fitBoundsIfRouteExists();
                }
            })
            .catch(err => console.error('Error fetching route from OSRM:', err));
    }

    private fitBoundsIfRouteExists() {
        if (this.routeLayer && this.map) {
            this.map.fitBounds(this.routeLayer.getBounds(), { padding: [50, 50] });
        }
    }
}