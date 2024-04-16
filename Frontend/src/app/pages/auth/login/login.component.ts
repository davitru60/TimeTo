import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environment/environment';
import { UserLogin } from '../interfaces/auth.interface';
import { CredentialResponse } from 'google-one-tap';
declare global {
  namespace google {
     export type GoogleOneTap = typeof import('google-one-tap');
  }
 }


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit{
  private clientId = environment.googleClientId;
  nuevoUsr: UserLogin = {
    email: '',
    password: '',
  };

  ngOnInit(): void {
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

  async handleCredentialResponse(response : CredentialResponse) {
    
  }
}
