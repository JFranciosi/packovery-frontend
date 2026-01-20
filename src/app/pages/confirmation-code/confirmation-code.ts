import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-confirmation-code',
    standalone: true,
    imports: [CommonModule, RouterLink, FormsModule],
    templateUrl: './confirmation-code.html',
    styleUrls: ['./confirmation-code.css']
})
export class ConfirmationCode implements OnInit {
    digits: string[] = ['', '', '', '', '', ''];
    email: string = '';
    private authService = inject(AuthService);
    private route = inject(ActivatedRoute);
    private router = inject(Router);

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.email = params['email'];
        });
    }

    resendCode() {
        if (!this.email) {
            alert('Email non trovata.');
            return;
        }
        this.authService.forgotPassword(this.email).subscribe({
            next: () => alert('Codice inviato di nuovo!'),
            error: (err) => alert('Errore: ' + (err.error?.message || err.message))
        });
    }

    onSubmit() {
        const code = this.digits.join('');
        if (code.length < 6) {
            alert('Inserisci il codice completo.');
            return;
        }
        this.authService.verifyCode(this.email, code).subscribe({
            next: () => {
                this.router.navigate(['/reset-password'], { queryParams: { email: this.email, code: code } });
            },
            error: (err) => {
                alert('Codice non valido o scaduto: ' + (err.error?.message || err.message));
            }
        });
    }

    // Helper to auto-focus next input
    onKeyUp(event: any, index: number) {
        if (event.key >= '0' && event.key <= '9') {
            const nextInput = event.target.nextElementSibling;
            if (nextInput) nextInput.focus();
        } else if (event.key === 'Backspace') {
            const prevInput = event.target.previousElementSibling;
            if (prevInput) prevInput.focus();
        }
    }
}
