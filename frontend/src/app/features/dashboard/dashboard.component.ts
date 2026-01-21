import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="dashboard">
      <h1>Dashboard</h1>
      
      @if (authService.user(); as user) {
        <div class="welcome-card">
          <h2>Benvenuto, {{ user.name }}!</h2>
          <p>Email: {{ user.email }}</p>
        </div>
      }
      
      <div class="cards-grid">
        <div class="card">
          <h3>Prodotti</h3>
          <p>Gestisci i tuoi prodotti</p>
          <a routerLink="/products" class="btn btn-primary">Vai ai Prodotti</a>
        </div>
        
        <div class="card">
          <h3>Counter</h3>
          <p>Esercizio Zoneless Change Detection</p>
          <a routerLink="/counter" class="btn btn-primary">Vai al Counter</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard {
      max-width: 1200px;
    }
    
    h1 {
      margin-bottom: 2rem;
    }
    
    .welcome-card {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      margin-bottom: 2rem;
    }
    
    .cards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.5rem;
    }
    
    .card {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .card h3 {
      margin-top: 0;
    }
    
    .btn {
      display: inline-block;
      padding: 0.75rem 1.5rem;
      background: #1976d2;
      color: white;
      text-decoration: none;
      border-radius: 4px;
      margin-top: 1rem;
      transition: background 0.2s;
    }
    
    .btn:hover {
      background: #1565c0;
    }
  `]
})
export class DashboardComponent {
  authService = inject(AuthService);
}
