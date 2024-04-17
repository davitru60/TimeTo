import { Component } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { UserLogin } from '../interfaces/auth.interface';
import { CredentialResponse } from 'google-one-tap';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

declare global {
  namespace google {
    export type GoogleOneTap = typeof import('google-one-tap');
  }
}

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  imports: [RouterLink, CommonModule, FormsModule,ReactiveFormsModule],
})
export class LoginComponent {
  private clientId = environment.googleClientId;
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

  ngAfterViewInit(): void {
    // @ts-ignore
    window.onGoogleLibraryLoad = () => {
      google.accounts.id.initialize({
        client_id: this.clientId,
        callback: this.handleCredentialResponse.bind(this),
        auto_select: false,
        cancel_on_tap_outside: true,
      });
      //@ts-ignore
      google.accounts.id.renderButton(
        //@ts-ignore
        document.getElementById('buttonDiv'),
        { theme: 'outline', size: 'large', width: '100%' }
      );
      // @ts-ignore
      google.accounts.id.prompt((notification: PromptMomentNotification) => {});
    };
  }

  async handleCredentialResponse(response: CredentialResponse) {}

  login() {
    const email = this.loginForm.get('email')?.value;
    const password = this.loginForm.get('password')?.value;

    this.user.email = email!;
    this.user.password = password!;

    console.log(this.user);

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
