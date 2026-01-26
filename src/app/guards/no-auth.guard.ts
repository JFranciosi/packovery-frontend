import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';


export const noAuthGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (authService.getAccessToken()) {
        const currentUrl = router.url;


        if (currentUrl !== '/' && currentUrl !== '/login' && currentUrl !== '') {
            return false;
        }


        router.navigate(['/order-search']);
        return false;
    }

    return true;
};
