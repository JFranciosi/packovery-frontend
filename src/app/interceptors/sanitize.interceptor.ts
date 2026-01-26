import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { SanitizeService } from '../services/sanitize.service';


export const sanitizeInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
    const sanitizeService = inject(SanitizeService);

    if (['POST', 'PUT', 'PATCH'].includes(req.method) && req.body) {
        req = req.clone({
            body: sanitizeService.sanitizeObject(req.body)
        });
    }

    if (req.params.keys().length > 0) {
        let sanitizedParams = req.params;
        for (const key of req.params.keys()) {
            const values = req.params.getAll(key);
            if (values) {
                sanitizedParams = sanitizedParams.delete(key);
                values.forEach(val => {
                    sanitizedParams = sanitizedParams.append(key, sanitizeService.sanitize(val));
                });
            }
        }
        req = req.clone({ params: sanitizedParams });
    }

    return next(req);
};
