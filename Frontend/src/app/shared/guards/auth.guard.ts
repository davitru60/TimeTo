import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './../../pages/auth/services/auth.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLogged()) {
    router.navigate(['']);
    return false;
  } else {
    return true;
  }
};
