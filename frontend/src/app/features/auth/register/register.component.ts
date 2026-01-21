import { Component, signal, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="register-container">
      <div class="register-card">
        <h1>Registrati</h1>
        
        <form (ngSubmit)="onSubmit()" #registerForm="ngForm">
          <div class="form-group">
            <label for="name">Nome</label>
            <input
              type="text"
              id="name"
              name="name"
              [(ngModel)]="name"
              required
              #nameInput="ngModel"
              [class.error]="nameInput.invalid && nameInput.touched"
            />
            @if (nameInput.invalid && nameInput.touched) {
              <span class="error-message">Nome obbligatorio</span>
            }
          </div>
          
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
            [disabled]="!registerForm.valid || loading()"
            class="btn btn-primary"
          >
            @if (loading()) {
              <span>Registrazione in corso...</span>
            } @else {
              <span>Registrati</span>
            }
          </button>
        </form>
        
        <p class="login-link">
          Hai già un account? <a routerLink="/login">Accedi</a>
        </p>
      </div>
    </div>
  `,
  styles: [`
    .register-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 60vh;
    }
    
    .register-card {
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
    
    .login-link {
      text-align: center;
      margin-top: 1rem;
    }
    
    .login-link a {
      color: #1976d2;
      text-decoration: none;
    }
  `]
})
export class RegisterComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  
  name = signal('');
  email = signal('');
  password = signal('');
  loading = signal(false);
  error = signal<string | null>(null);
  
  onSubmit(): void {
    if (!this.name() || !this.email() || !this.password()) {
      return;
    }
    
    this.loading.set(true);
    this.error.set(null);
    
    this.authService.register(this.email(), this.password(), this.name())
      .subscribe({
        next: () => {
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          this.error.set(err.error?.error || 'Errore durante la registrazione');
          this.loading.set(false);
        }
      });
  }
}
