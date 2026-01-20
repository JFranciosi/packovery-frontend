import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-reset-password',
    standalone: true,
    imports: [CommonModule, RouterLink, FormsModule],
    templateUrl: './reset-password.html',
    styleUrls: ['./reset-password.css']
})
export class ResetPassword implements OnInit {
    password: string = '';
    confirmPassword: string = '';
    email: string = '';
    code: string = '';

    private authService = inject(AuthService);
    private route = inject(ActivatedRoute);
    private router = inject(Router);

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.email = params['email'];
            this.code = params['code'];
        });
    }

    onSubmit() {
        if (!this.password || !this.confirmPassword) {
            alert('Inserisci entrambe le password.');
            return;
        }

        if (this.password !== this.confirmPassword) {
            alert('Le password non coincidono.');
            return;
        }

        if (!this.email || !this.code) {
            alert('Dati mancanti (email o codice). Riprova la procedura.');
            this.router.navigate(['/forgot-password']);
            return;
        }

        this.authService.resetPassword(this.email, this.code, this.password).subscribe({
            next: () => {
                alert('Password modificata con successo!');
                this.router.navigate(['/login']);
            },
            error: (err) => {
                alert('Errore durante il reset della password: ' + (err.error?.message || err.message));
            }
        });
    }
}
