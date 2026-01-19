import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-confirmation-code',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './confirmation-code.html',
    styleUrls: ['./confirmation-code.css']
})
export class ConfirmationCode {
    private authService = inject(AuthService);

    resendCode() {
        const email = 'user@example.com'; // TODO: Retrieve actual email
        this.authService.resendCode(email).subscribe(() => {
            alert('Codice inviato di nuovo!');
        });
    }
}
