import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-confirmation-code',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './confirmation-code.html',
    styleUrls: ['./confirmation-code.css']
})
export class ConfirmationCode implements OnInit {
    digits: string[] = ['', '', '', '', '', ''];
    email: string = '';
    isLoading: boolean = false;
    isResending: boolean = false;
    private authService = inject(AuthService);
    private route = inject(ActivatedRoute);
    private router = inject(Router);

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.email = params['email'];
        });
    }


    onDigitInput(event: any, index: number) {
        this.digits[index] = event.target.value;
    }

    resendCode() {
        if (!this.email) {
            alert('Email non trovata.');
            return;
        }
        if (this.isResending) return;
        this.isResending = true;

        this.authService.forgotPassword(this.email).subscribe({
            next: () => {
                this.isResending = false;
                alert('Codice inviato di nuovo!');
            },
            error: (err) => {
                this.isResending = false;
                alert('Errore: ' + (err.error?.message || err.message));
            }
        });
    }

    onSubmit() {
        const code = this.digits.join('');
        if (code.length < 6) {
            alert('Inserisci il codice completo.');
            return;
        }
        if (this.isLoading) return;
        this.isLoading = true;

        this.authService.verifyCode(this.email, code).subscribe({
            next: () => {
                this.isLoading = false;
                this.router.navigate(['/reset-password'], { queryParams: { email: this.email, code: code } });
            },
            error: (err) => {
                this.isLoading = false;
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

    onPaste(event: ClipboardEvent) {
        event.preventDefault();
        const clipboardData = event.clipboardData || (window as any).clipboardData;
        const pastedData = clipboardData.getData('Text');

        if (pastedData) {
            const chars = pastedData.trim().split('');
            for (let i = 0; i < 6 && i < chars.length; i++) {
                if (chars[i] >= '0' && chars[i] <= '9') {
                    this.digits[i] = chars[i];
                }
            }
            // Focus the last filled input or the first empty one
            setTimeout(() => {
                const inputs = document.querySelectorAll('.code-input');
                const lastIndex = Math.min(chars.length, 6) - 1;
                if (lastIndex >= 0 && inputs[lastIndex]) {
                    (inputs[lastIndex] as HTMLElement).focus();
                }
            }, 0);
        }
    }
}
