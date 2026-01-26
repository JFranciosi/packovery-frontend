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
    errorMessage: string = '';
    successMessage: string = '';

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



    onFormSubmit(passValue: string, confirmValue: string, event: Event) {
        event.preventDefault();
        this.password = passValue;
        this.confirmPassword = confirmValue;
        this.onSubmit();
    }

    togglePasswordVisibility(): void {
        this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
    }

    toggleConfirmPasswordVisibility(): void {
        this.confirmPasswordFieldType = this.confirmPasswordFieldType === 'password' ? 'text' : 'password';
    }

    onSubmit() {
        this.errorMessage = '';
        this.successMessage = '';

        if (!this.password || !this.confirmPassword) {
            this.errorMessage = 'Inserisci entrambe le password.';
            return;
        }

        if (this.password !== this.confirmPassword) {
            this.errorMessage = 'Le password non coincidono.';
            return;
        }

        if (!this.email || !this.code) {
            this.errorMessage = 'Dati mancanti (email o codice). Riprova la procedura.';
            return;
        }

        if (this.isLoading) return;
        this.isLoading = true;

        this.authService.resetPassword(this.email, this.code, this.password).subscribe({
            next: () => {
                this.isLoading = false;
                this.successMessage = 'Password modificata con successo!';
                setTimeout(() => {
                    this.router.navigate(['/']);
                }, 2000);
            },
            error: (err) => {
                this.isLoading = false;
                this.errorMessage = err.error || err.message || 'Errore durante il reset della password';
            }
        });
    }
}
