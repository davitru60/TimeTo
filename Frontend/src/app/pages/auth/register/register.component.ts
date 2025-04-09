import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { UserRegister } from '../../../core/interfaces/auth.interface';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  showPassword = false;
  showPasswordConfirm = false;

  user: UserRegister = {
    name: '',
    first_surname: '',
    second_surname: '',
    email: '',
    password: ''
  }

  registerForm: FormGroup;
  touch: boolean = false;

  constructor(private formBuilder: FormBuilder,private authService: AuthService, public router: Router) {
    this.registerForm = this.formBuilder.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20),
        ],
      ],
      email: ['', [Validators.required, Validators.email]],
      firstLastName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      password: ['', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)]],
      secondLastName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      confirmPassword: ['', Validators.required],
    });
  }

  register() {
    if (this.registerForm.status != 'INVALID') {
      this.user.name = this.registerForm.get('name')?.value || '';
      this.user.first_surname = this.registerForm.get('firstLastName')?.value || '';
      this.user.second_surname = this.registerForm.get('secondLastName')?.value || '';
      this.user.email = this.registerForm.get('email')?.value || '';
      this.user.password = this.registerForm.get('password')?.value || '';
      
      this.authService.register(this.user).subscribe(
        (response)=>{
          this.router.navigate(['/login']);
      })
    } else {
      this.touch = true;
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  togglePasswordConfirmVisibility(): void {
    this.showPasswordConfirm = !this.showPasswordConfirm;
  }

  passwordsMatch(): boolean {
    const password = this.registerForm.get('password')?.value;
    const confirmPassword = this.registerForm.get('confirmPassword')?.value;
    return password === confirmPassword;
  }
}
