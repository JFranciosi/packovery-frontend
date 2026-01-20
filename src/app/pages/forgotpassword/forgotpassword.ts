import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-forgotpassword',
    standalone: true,
    imports: [CommonModule, RouterLink, FormsModule],
    templateUrl: './forgotpassword.html',
    styleUrls: ['./forgotpassword.css']
})
export class Forgotpassword {
    email: string = '';
    isLoading: boolean = false;
    private authService = inject(AuthService);
    private router = inject(Router);

    onSubmit() {
        if (!this.email) {
            alert('Inserisci un indirizzo email.');
            return;
        }
        if (this.isLoading) return;
        this.isLoading = true;

        this.authService.forgotPassword(this.email).subscribe({
            next: () => {
                this.isLoading = false;
                this.router.navigate(['/confirmation-code'], { queryParams: { email: this.email } });
            },
            error: (err) => {
                this.isLoading = false;
                alert('Errore durante l\'invio del codice: ' + (err.error?.message || err.message));
            }
        });
    }
}
