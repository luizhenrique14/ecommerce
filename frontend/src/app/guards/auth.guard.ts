import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route: any, state: any) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const token = authService.getToken();
  const user = authService.getUser();

  if (!token) {
    router.navigate(['/login']);
    return false;
  }

  // If route is admin area, require isAdmin
  const url: string = state?.url || '';
  if (url.startsWith('/admin')) {
    if (user && (user.isAdmin === true || user.isAdmin === 1)) {
      return true;
    }
    // Not admin: redirect to products
    router.navigate(['/products']);
    return false;
  }

  return true;
};

