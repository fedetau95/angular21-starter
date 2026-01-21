import { HttpInterceptorFn } from '@angular/common/http';
import { inject, Injector } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  // Use Injector to avoid circular dependency
  const injector = inject(Injector);
  const token = localStorage.getItem('token');
  
  if (token && !req.url.includes('/api/login') && !req.url.includes('/api/register')) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
  
  return next(req);
};
