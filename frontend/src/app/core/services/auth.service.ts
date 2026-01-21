import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, map } from 'rxjs';

export interface User {
  id: number;
  email: string;
  name: string;
  created_at?: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  
  private token = signal<string | null>(
    localStorage.getItem('token')
  );
  
  private currentUser = signal<User | null>(null);
  
  readonly isAuthenticated = computed(() => !!this.token());
  readonly user = this.currentUser.asReadonly();
  
  constructor() {
    // Load user if token exists
    if (this.token()) {
      this.loadCurrentUser().subscribe();
    }
  }
  
  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>('/api/login', { email, password })
      .pipe(
        tap(response => {
          this.token.set(response.token);
          this.currentUser.set(response.user);
          localStorage.setItem('token', response.token);
        })
      );
  }
  
  register(email: string, password: string, name: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>('/api/register', { email, password, name })
      .pipe(
        tap(response => {
          this.token.set(response.token);
          this.currentUser.set(response.user);
          localStorage.setItem('token', response.token);
        })
      );
  }
  
  logout(): void {
    this.token.set(null);
    this.currentUser.set(null);
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
  
  getToken(): string | null {
    return this.token();
  }
  
  loadCurrentUser(): Observable<User> {
    return this.http.get<User>('/api/me')
      .pipe(
        tap(user => this.currentUser.set(user))
      );
  }
}
