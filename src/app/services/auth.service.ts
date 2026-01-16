
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private http = inject(HttpClient);
    private apiUrl = '/auth'; // Proxied to http://localhost:8080/auth

    login(credentials: { email: string; password: string }): Observable<any> {
        // The backend endpoint is /auth/login
        return this.http.post(`${this.apiUrl}/login`, credentials);
    }
}
