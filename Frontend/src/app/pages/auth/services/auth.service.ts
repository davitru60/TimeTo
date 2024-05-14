import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { GoogleSignInToken, LoginResponse, LoginResponseError, RegisterResponse, UserLogin, UserRegister } from './../interfaces/auth.interface';
import { authRoutes, endpoints, environment } from '../../../../environments/environment.development';
import { catchError,map, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = sessionStorage.getItem('token') ? true : false;

  constructor(private http:HttpClient) { 
   
  }

  login(user: UserLogin) {
    return this.http.post<LoginResponse>(environment.baseUrl + endpoints.authEndpoint + authRoutes.login, user)
      .pipe(
        map((auth: LoginResponse) => {
          this.loggedIn = true;
          return auth; 
        }),
        catchError((error: HttpErrorResponse) => {
          const errorResponse: LoginResponseError = {
            success: false,
            msg: error.error.msg || 'Unknown error',
            data: error.error.data || {}
          };
          console.error('Login error:', errorResponse.msg);
          return throwError(errorResponse);
        })
      );
  }

  googleSignIn(idToken: GoogleSignInToken) {
    return this.http.post<any>(environment.baseUrl + endpoints.authEndpoint + authRoutes.googleSignIn, idToken).pipe(
      map((response) => {
        if (response.success) {
          this.loggedIn = true; 
        }
        return response;
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Google Sign-In error:', error.message || 'Unknown error');
        return throwError(error);
      })
    );
  }

  register(user: UserRegister){
    return this.http.post<RegisterResponse>(environment.baseUrl+endpoints.authEndpoint+authRoutes.register, user)
  }

  logout():boolean{
    sessionStorage.removeItem('token')
    window.location.reload()
    return true
  }

  isLogged():boolean{
    return this.loggedIn
  }

}
