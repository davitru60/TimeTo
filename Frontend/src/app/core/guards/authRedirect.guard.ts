import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './../../pages/auth/services/auth.service';
import { inject } from '@angular/core';

export const authRedirectGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLogged()) {
    return true
  } else {
    router.navigate(['/login']); 
    return false;
  }
};
