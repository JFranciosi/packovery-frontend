import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const resetPasswordGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (state.url.includes('confirmation-code')) {
        if (authService.getResetEmail()) {
            return true;
        }
    }

    if (state.url.includes('reset-password')) {
        const email = route.queryParams['email'];
        const code = route.queryParams['code'];
        if (email && code) {
            return true;
        }
    }

    router.navigate(['/login']);
    return false;
};
