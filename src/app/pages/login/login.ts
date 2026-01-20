import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
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
