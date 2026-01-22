import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { throwError, BehaviorSubject } from 'rxjs';
import { catchError, switchMap, filter, take } from 'rxjs/operators';

let isRefreshing = false;
const refreshTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);
    const token = localStorage.getItem('accessToken');
    if (req.url.includes('/auth/login') || req.url.includes('/auth/register') || req.url.includes('/auth/refresh')) {
        return next(req);
    }

    let authReq = req;
    if (token) {
        authReq = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });
    }

    return next(authReq).pipe(
        catchError((error) => {
            if (error instanceof HttpErrorResponse && error.status === 401 && !req.url.includes('/auth/logout')) {
                if (req.url.includes('/auth/refresh')) {
                    authService.logout().subscribe();
                    return throwError(() => error);
                }

                if (!isRefreshing) {
                    isRefreshing = true;
                    refreshTokenSubject.next(null);

                    return authService.refreshToken().pipe(
                        switchMap((response: any) => {
                            isRefreshing = false;
                            const newToken = response.accessToken;
                            refreshTokenSubject.next(newToken);
                            return next(req.clone({
                                setHeaders: {
                                    Authorization: `Bearer ${newToken}`
                                }
                            }));
                        }),
                        catchError((err) => {
                            isRefreshing = false;
                            authService.logout().subscribe();
                            return throwError(() => err);
                        })
                    );
                } else {
                    return refreshTokenSubject.pipe(
                        filter(token => token !== null),
                        take(1),
                        switchMap(jwt => {
                            return next(req.clone({
                                setHeaders: {
                                    Authorization: `Bearer ${jwt}`
                                }
                            }));
                        })
                    );
                }
            }
            return throwError(() => error);
        })
    );
};
