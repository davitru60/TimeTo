import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  let cloneRequest = req
  const param = req.params.get('auth')

  if(param){
    const token = sessionStorage.getItem('token')!
    cloneRequest = req.clone({
      headers: req.headers.set('x-token',token)
    })
  }


  return next(req);
};
