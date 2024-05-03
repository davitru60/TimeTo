import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SocialAuthService, GoogleSigninButtonModule,SocialUser } from '@abacritt/angularx-social-login';
import { AuthService } from '../../services/auth.service';
import { GoogleSignInToken } from '../../interfaces/auth.interface';

@Component({
  selector: 'app-google-auth',
  standalone: true,
  imports: [CommonModule,GoogleSigninButtonModule],
  templateUrl: './google-auth.component.html',
  styleUrl: './google-auth.component.scss'
})
export class GoogleAuthComponent implements OnInit {
  user: SocialUser | null = null;
  loggedIn: boolean = false;

  googleToken: GoogleSignInToken ={
    id_token: ''
  }

  constructor(private socialAuthService: SocialAuthService, private authService:AuthService) { }

  ngOnInit() {
    this.socialAuthService.authState.subscribe((user) => {
      this.user = user;
      this.loggedIn = (user != null);

      if (this.loggedIn && user) {
        this.googleToken.id_token=user.idToken
        this.sendAuthToken(this.googleToken)
      }

    });
  }


  sendAuthToken(signInToken:GoogleSignInToken){
    this.authService.googleSignIn(signInToken).subscribe((response)=>{
      if (response.success) {
        console.log('Token enviado exitosamente');
      } else {
        console.error('Error al enviar el token:', response.message);
      }
    })
  }

}
