import { Component, signal, computed, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="login-container">
      <div class="login-card">
        <h1>Login</h1>
        
        <form (ngSubmit)="onSubmit()" #loginForm="ngForm">
          <div class="form-group">
            <label for="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              [(ngModel)]="email"
              required
              email
              #emailInput="ngModel"
              [class.error]="emailInput.invalid && emailInput.touched"
            />
            @if (emailInput.invalid && emailInput.touched) {
              <span class="error-message">Email obbligatoria e valida</span>
            }
          </div>
          
          <div class="form-group">
            <label for="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              [(ngModel)]="password"
              required
              minlength="6"
              #passwordInput="ngModel"
              [class.error]="passwordInput.invalid && passwordInput.touched"
            />
            @if (passwordInput.invalid && passwordInput.touched) {
              <span class="error-message">Password obbligatoria (min 6 caratteri)</span>
            }
          </div>
          
          @if (error()) {
            <div class="alert alert-error">
              {{ error() }}
            </div>
          }
          
          <button
            type="submit"
            [disabled]="!loginForm.valid || loading()"
            class="btn btn-primary"
          >
            @if (loading()) {
              <span>Accesso in corso...</span>
            } @else {
              <span>Accedi</span>
            }
          </button>
        </form>
        
        <p class="register-link">
          Non hai un account? <a routerLink="/register">Registrati</a>
        </p>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 60vh;
    }
    
    .login-card {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      width: 100%;
      max-width: 400px;
    }
    
    h1 {
      margin-bottom: 1.5rem;
      text-align: center;
    }
    
    .form-group {
      margin-bottom: 1rem;
    }
    
    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
    }
    
    input {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
    }
    
    input.error {
      border-color: #f44336;
    }
    
    .error-message {
      color: #f44336;
      font-size: 0.875rem;
      margin-top: 0.25rem;
      display: block;
    }
    
    .alert {
      padding: 0.75rem;
      border-radius: 4px;
      margin-bottom: 1rem;
    }
    
    .alert-error {
      background: #ffebee;
      color: #c62828;
      border: 1px solid #ef5350;
    }
    
    .btn {
      width: 100%;
      padding: 0.75rem;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      cursor: pointer;
      transition: background 0.2s;
    }
    
    .btn-primary {
      background: #1976d2;
      color: white;
    }
    
    .btn-primary:hover:not(:disabled) {
      background: #1565c0;
    }
    
    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    
    .register-link {
      text-align: center;
      margin-top: 1rem;
    }
    
    .register-link a {
      color: #1976d2;
      text-decoration: none;
    }
  `]
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  
  email = signal('');
  password = signal('');
  loading = signal(false);
  error = signal<string | null>(null);
  
  onSubmit(): void {
    if (!this.email() || !this.password()) {
      return;
    }
    
    this.loading.set(true);
    this.error.set(null);
    
    this.authService.login(this.email(), this.password())
      .subscribe({
        next: () => {
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          this.error.set(err.error?.error || 'Errore durante il login');
          this.loading.set(false);
        }
      });
  }
}
