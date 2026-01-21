import { Component, signal, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { form, FormField, required, email, minLength } from '@angular/forms/signals';
import { AuthService } from '../../../core/services/auth.service';

interface RegisterModel {
  name: string;
  email: string;
  password: string;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormField, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  
  registerModel = signal<RegisterModel>({ name: '', email: '', password: '' });
  
  registerForm = form(this.registerModel, (f) => {
    required(f.name, { message: 'Nome obbligatorio' });
    required(f.email, { message: 'Email obbligatoria' });
    email(f.email, { message: 'Email non valida' });
    required(f.password, { message: 'Password obbligatoria' });
    minLength(f.password, 6, { message: 'Password deve essere almeno 6 caratteri' });
  });
  
  loading = signal(false);
  error = signal<string | null>(null);
  
  onSubmit(event: Event): void {
    event.preventDefault();
    
    if (this.registerForm().invalid()) {
      return;
    }
    
    this.loading.set(true);
    this.error.set(null);
    
    const model = this.registerModel();
    this.authService.register(model.email, model.password, model.name)
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
