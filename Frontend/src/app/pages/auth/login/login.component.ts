import { Component } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { UserLogin } from '../../../core/interfaces/auth.interface';
import { GoogleAuthComponent } from './google-auth/google-auth.component';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';



@Component({
    selector: 'app-login',
    standalone: true,
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss',
    imports: [RouterLink, CommonModule, FormsModule, ReactiveFormsModule,GoogleAuthComponent]
})
export class LoginComponent {
  user: UserLogin = {
    email: '',
    password: '',
  };

  showPassword = false;
  loginForm: FormGroup;
  errorMessageVisible = false;

  constructor(
    public router: Router,
    public authService: AuthService,
    private formBuilder: FormBuilder

  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

 
  login() {
    const email = this.loginForm.get('email')?.value;
    const password = this.loginForm.get('password')?.value;

    this.user.email = email!;
    this.user.password = password!;

    this.authService.login(this.user).subscribe((response) => {
      if (response?.success) {
        sessionStorage.setItem('token', response.data.token);
        this.router.navigate(['']);
      }else{}
    }, (error)=>{
        this.showErroMessage()
    });
  }

 
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  showErroMessage(){
    this.errorMessageVisible = true;
    setTimeout(() => {
      this.errorMessageVisible = false;
    }, 2000);
  }

  clearFields() {
    this.user = {
      email: '',
      password: '',
    };
  }

 
}
