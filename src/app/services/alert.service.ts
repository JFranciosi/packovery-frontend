import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AlertRequest } from '../model/models';

@Injectable({
    providedIn: 'root'
})
export class AlertService {
    private http = inject(HttpClient);
    private apiUrl = '/alert';

    createAlert(request: AlertRequest): Observable<string> {
        return this.http.post(this.apiUrl, request, { responseType: 'text' });
    }
}
