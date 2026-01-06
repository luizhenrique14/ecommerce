import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (_route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.getToken()) {
    router.navigate(['/login']);
    return false;
  }

  const url = state.url || '';
  if (url.startsWith('/admin')) {
    if (authService.isAdmin()) {
      return true;
    }
    router.navigate(['/products']);
    return false;
  }

  return true;
};
