import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {
  GoogleSignInToken,
  LoginResponse,
  LoginResponseError,
  RegisterResponse,
  UserLogin,
  UserRegister,
} from '../../../core/interfaces/auth.interface';
import {
  authRoutes,
} from '../../../../environments/environment.development';
import { catchError, map, throwError } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private loggedIn = sessionStorage.getItem('token') ? true : false;
  private jwtHelper = new JwtHelperService();

  constructor(private http: HttpClient) {}

  login(user: UserLogin) {
    return this.http
      .post<LoginResponse>(
        authRoutes.login,
        user
      )
      .pipe(
        map((auth: LoginResponse) => {
          this.loggedIn = true;
          return auth;
        }),
        catchError((error: HttpErrorResponse) => {
          const errorResponse: LoginResponseError = {
            success: false,
            msg: error.error.msg || 'Unknown error',
            data: error.error.data || {},
          };
          console.error('Login error:', errorResponse.msg);
          return throwError(errorResponse);
        })
      );
  }

  googleSignIn(idToken: GoogleSignInToken) {
    return this.http.post<any>(authRoutes.googleSignIn, idToken).pipe(
      map((response) => {
        if (response.success) {
          this.loggedIn = true;
        }
        return response;
      }),
      catchError((error: HttpErrorResponse) => {
        console.error(
          'Google Sign-In error:',
          error.message || 'Unknown error'
        );
        return throwError(error);
      })
    );
  }

  register(user: UserRegister) {
    return this.http.post<RegisterResponse>(authRoutes.register, user);
  }

  logout(): boolean {
    sessionStorage.removeItem('token');
    return true;
  }

  isLogged(): boolean {
    return this.loggedIn;
  }

  isAdmin(): boolean {
    let result = false;

    const token = sessionStorage.getItem('token');
    if (token) {
      const decodedToken = this.jwtHelper.decodeToken(token);
      const roles = decodedToken.roles
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === 'admin') {
          return true
        }
      }
    } else {
      result = false;
    }

    return result;
  }

  isClient(): boolean {
    let result = false;

    const token = sessionStorage.getItem('token');
    if (token) {
      const decodedToken = this.jwtHelper.decodeToken(token);
      const roles = decodedToken.roles
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === 'cliente') {
          return true
        }
      }
    } else {
      result = false;
    }

    return result;
  }
}
