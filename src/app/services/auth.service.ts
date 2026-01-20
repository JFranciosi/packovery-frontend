
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private http = inject(HttpClient);
    private router = inject(Router);
    private apiUrl = '/auth';

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
        return this.http.post(`${this.apiUrl}/forgot-password`, { email });
    }

    verifyCode(email: string, code: string): Observable<any> {
        return this.http.post(`${this.apiUrl}/verify-code`, { email, code });
    }

    resetPassword(email: string, code: string, newPassword: string): Observable<any> {
        return this.http.post(`${this.apiUrl}/reset-password`, { email, code, newPassword });
    }

    logout() {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        this.router.navigate(['/login']);
    }
}
