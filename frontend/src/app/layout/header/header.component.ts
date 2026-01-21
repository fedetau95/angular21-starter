import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <header class="header">
      <nav class="nav">
        <div class="nav-brand">
          <a routerLink="/dashboard">Angular 21 Starter</a>
        </div>
        
        <div class="nav-links">
          @if (authService.isAuthenticated()) {
            <a routerLink="/dashboard" routerLinkActive="active">Dashboard</a>
            <a routerLink="/products" routerLinkActive="active">Prodotti</a>
            <a routerLink="/counter" routerLinkActive="active">Counter</a>
            <div class="user-info">
              <span>{{ authService.user()?.name }}</span>
              <button (click)="logout()" class="btn-logout">Logout</button>
            </div>
          } @else {
            <a routerLink="/login" routerLinkActive="active">Login</a>
            <a routerLink="/register" routerLinkActive="active">Registrati</a>
          }
        </div>
      </nav>
    </header>
  `,
  styles: [`
    .header {
      background: #1976d2;
      color: white;
      padding: 1rem 2rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .nav {
      display: flex;
      justify-content: space-between;
      align-items: center;
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .nav-brand a {
      font-size: 1.5rem;
      font-weight: bold;
      color: white;
      text-decoration: none;
    }
    
    .nav-links {
      display: flex;
      gap: 1.5rem;
      align-items: center;
    }
    
    .nav-links a {
      color: white;
      text-decoration: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      transition: background 0.2s;
    }
    
    .nav-links a:hover,
    .nav-links a.active {
      background: rgba(255, 255, 255, 0.2);
    }
    
    .user-info {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    
    .btn-logout {
      background: rgba(255, 255, 255, 0.2);
      border: 1px solid white;
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;
      transition: background 0.2s;
    }
    
    .btn-logout:hover {
      background: rgba(255, 255, 255, 0.3);
    }
  `]
})
export class HeaderComponent {
  authService = inject(AuthService);
  
  logout(): void {
    this.authService.logout();
  }
}
