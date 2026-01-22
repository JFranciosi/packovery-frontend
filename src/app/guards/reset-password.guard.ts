import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const resetPasswordGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const path = route.routeConfig?.path;

    if (path === 'confirmation-code') {
        if (authService.getResetEmail()) {
            return true;
        }
    }

    if (path === 'reset-password') {
        const email = route.queryParams['email'];
        const code = route.queryParams['code'];
        if (email && code) {
            return true;
        }
    }

    router.navigate(['/']);
    return false;
};
