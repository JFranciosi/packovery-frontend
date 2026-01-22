
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private http = inject(HttpClient);
    private router = inject(Router);
    private apiUrl = `${environment.apiUrl}/auth`;
    private resetEmail: string | null = null;

    login(credentials: { email: string; password: string }): Observable<any> {
        return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
            tap((response: any) => {
                if (response && response.accessToken) {
                    localStorage.setItem('accessToken', response.accessToken);
                }
                if (response && response.refreshToken) {
                    localStorage.setItem('refreshToken', response.refreshToken);
                }
            })
        );
    }

    resendCode(email: string): Observable<any> {
        return this.http.post(`${this.apiUrl}/forgot-password`, { email });
    }

    forgotPassword(email: string): Observable<any> {
        return this.http.post(`${this.apiUrl}/forgot-password`, { email }, { responseType: 'text' });
    }

    verifyCode(email: string, code: string): Observable<any> {
        return this.http.post(`${this.apiUrl}/verify-code`, { email, code }, { responseType: 'text' });
    }

    resetPassword(email: string, code: string, newPassword: string): Observable<any> {
        return this.http.post(`${this.apiUrl}/reset-password`, { email, code, newPassword }, { responseType: 'text' });
    }

    refreshToken(): Observable<any> {
        const refreshToken = localStorage.getItem('refreshToken');
        return this.http.post(`${this.apiUrl}/refresh`, {}, {
            headers: {
                Authorization: `Bearer ${refreshToken}`
            }
        }).pipe(
            tap((response: any) => {
                if (response && response.accessToken) {
                    localStorage.setItem('accessToken', response.accessToken);
                }
                if (response && response.refreshToken) {
                    localStorage.setItem('refreshToken', response.refreshToken);
                }
            })
        );
    }

    getAccessToken(): string | null {
        return localStorage.getItem('accessToken');
    }

    getUserEmail(): string | null {
        const token = this.getAccessToken();
        if (!token) return null;
        try {
            const payload = token.split('.')[1];
            const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
            const decoded = atob(base64);
            const json = JSON.parse(decoded);
            return json.sub || json.email || json.upn || json.preferred_username || json.username || null;
        } catch (e) {
            console.error('Error parsing token user:', e);
            return null;
        }
    }

    setResetEmail(email: string) {
        this.resetEmail = email;
    }

    getResetEmail(): string | null {
        return this.resetEmail;
    }

    logout() {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        this.router.navigate(['/']);
    }
}
