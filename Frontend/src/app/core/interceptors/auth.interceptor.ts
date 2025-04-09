import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../../pages/auth/services/auth.service';
import { inject } from '@angular/core';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const authService = inject(AuthService)

  let cloneRequest = req
  const param = req.params.get('auth')

  if(param){
    const token = authService.getAuthToken()!
    cloneRequest = req.clone({
      headers: req.headers.set('x-token',token)
    })
    
  }

  return next(cloneRequest);
};
