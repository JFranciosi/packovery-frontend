import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { AlertRequest, AlertResponse } from '../model/models';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AlertService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/alert`;

    createAlert(request: AlertRequest): Observable<string> {
        return this.http.post(this.apiUrl, request, { responseType: 'text' });
    }

    getAlerts(): Observable<AlertResponse[]> {
        return this.http.get<AlertResponse[]>(this.apiUrl);
    }

    updateAlertStatus(id: number, status: boolean): Observable<string> {
        return this.http.put(`${this.apiUrl}/${id}/status`, { status }, { responseType: 'text' });
    }

    deleteAlert(id: number): Observable<string> {
        return this.http.delete(`${this.apiUrl}/${id}`, { responseType: 'text' });
    }

    updateAlert(id: number, request: AlertRequest): Observable<string> {
        return this.http.put(`${this.apiUrl}/${id}`, request, { responseType: 'text' });
    }

    getAlertById(id: number): Observable<AlertResponse | undefined> {
        // Mocking a GET by ID since backend only has listAll
        return this.getAlerts().pipe(
            map(alerts => alerts.find(a => a.id === id))
        );
    }

    getSelectOptions(): Observable<import('../model/models').SelectOptionsResponse> {
        return this.http.get<import('../model/models').SelectOptionsResponse>(`${this.apiUrl}/select-options`);
    }
}
