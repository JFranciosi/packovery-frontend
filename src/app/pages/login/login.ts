import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  private authService = inject(AuthService);
  private router = inject(Router);

  email = '';
  password = '';
  errorMessage = '';
  passwordFieldType: string = 'password';
  isLoading: boolean = false;

  onFormSubmit(emailValue: string, passwordValue: string, event: Event) {
    event.preventDefault();
    this.email = emailValue;
    this.password = passwordValue;
    this.login();
  }

  togglePasswordVisibility(): void {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }

  login() {
    if (this.isLoading) return;
    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: (response) => {
        console.log('Login successful', response);
        this.isLoading = false;
        this.router.navigate(['/order-search']);
      },
      error: (err) => {
        console.error('Login failed', err);
        this.isLoading = false;
        if (err.status === 401) {
          this.errorMessage = 'Credenziali non valide. Riprova.';
        } else {
          this.errorMessage = err.error?.message || 'Errore durante il login. Riprova più tardi.';
        }
      }
    });
  }
}
