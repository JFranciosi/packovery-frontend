import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Impedisce agli utenti già autenticati di tornare alle pagine guest (come Login).
 * Se l'utente è già loggato e prova ad accedere alla login, viene riportato 
 * alla pagina principale (order-search).
 */
export const noAuthGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (authService.getAccessToken()) {
        const currentUrl = router.url;

        // Se l'utente è già all'interno di una pagina del sito (non è sulla root o login)
        // e prova a forzare l'indirizzo verso il login, annulliamo la navigazione
        // per lasciarlo dove si trova.
        if (currentUrl !== '/' && currentUrl !== '/login' && currentUrl !== '') {
            return false;
        }

        // Se invece sta entrando nel sito per la prima volta (o è sulla login),
        // lo mandiamo alla dashboard principale.
        router.navigate(['/order-search']);
        return false;
    }

    return true;
};
