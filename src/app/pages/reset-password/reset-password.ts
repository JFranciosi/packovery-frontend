import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-reset-password',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './reset-password.html',
    styleUrls: ['./reset-password.css']
})
export class ResetPassword implements OnInit {
    password: string = '';
    confirmPassword: string = '';
    email: string = '';
    code: string = '';
    isLoading: boolean = false;
    isResending: boolean = false;

    passwordFieldType: string = 'password';
    confirmPasswordFieldType: string = 'password';

    private authService = inject(AuthService);
    private route = inject(ActivatedRoute);
    private router = inject(Router);

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.email = params['email'];
            this.code = params['code'];
        });
    }

    resendCode() {
        if (!this.email) {
            alert('Email non trovata. Riprova la procedura.');
            this.router.navigate(['/forgot-password']);
            return;
        }

        if (this.isResending) return;
        this.isResending = true;

        this.authService.forgotPassword(this.email).subscribe({
            next: () => {
                this.isResending = false;
                alert('Nuovo codice inviato! Inserisci il nuovo codice.');
                this.router.navigate(['/confirmation-code'], { queryParams: { email: this.email } });
            },
            error: (err) => {
                this.isResending = false;
                alert('Errore: ' + (err.error?.message || err.message));
            }
        });
    }

    onPasswordInput(event: any) {
        this.password = event.target.value;
    }

    onConfirmPasswordInput(event: any) {
        this.confirmPassword = event.target.value;
    }

    togglePasswordVisibility(): void {
        this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
    }

    toggleConfirmPasswordVisibility(): void {
        this.confirmPasswordFieldType = this.confirmPasswordFieldType === 'password' ? 'text' : 'password';
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

        if (this.isLoading) return;
        this.isLoading = true;

        this.authService.resetPassword(this.email, this.code, this.password).subscribe({
            next: () => {
                this.isLoading = false;
                alert('Password modificata con successo!');
                this.router.navigate(['/login']);
            },
            error: (err) => {
                this.isLoading = false;
                alert('Errore durante il reset della password: ' + (err.error?.message || err.message));
            }
        });
    }
}
