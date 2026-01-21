import { Component, signal, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { form, FormField, required, email, minLength } from '@angular/forms/signals';
import { AuthService } from '../../../core/services/auth.service';

interface LoginModel {
  email: string;
  password: string;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormField, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  
  loginModel = signal<LoginModel>({ email: '', password: '' });
  
  loginForm = form(this.loginModel, (f) => {
    required(f.email, { message: 'Email obbligatoria' });
    email(f.email, { message: 'Email non valida' });
    required(f.password, { message: 'Password obbligatoria' });
    minLength(f.password, 6, { message: 'Password deve essere almeno 6 caratteri' });
  });
  
  loading = signal(false);
  error = signal<string | null>(null);
  
  onSubmit(event: Event): void {
    event.preventDefault();
    
    if (this.loginForm().invalid()) {
      return;
    }
    
    this.loading.set(true);
    this.error.set(null);
    
    const model = this.loginModel();
    this.authService.login(model.email, model.password)
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
