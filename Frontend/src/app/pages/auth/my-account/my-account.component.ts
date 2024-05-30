import { Component } from '@angular/core';
import { NavbarComponent } from '../../../shared/components/layout/navbar/navbar.component';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { UserRegister } from '../../../core/interfaces/auth.interface';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  Category,
  CategoryGetResponse,
} from '../../../core/interfaces/category.interface';
import { ProjectService } from '../../projects/services/project.service';
import { UserInterest, UserInterestGetResponse } from '../../../core/interfaces/user-preferences';


@Component({
  selector: 'app-my-account',
  standalone: true,
  templateUrl: './my-account.component.html',
  styleUrl: './my-account.component.scss',
  imports: [CommonModule, NavbarComponent, ReactiveFormsModule],
})
export class MyAccountComponent {
  showPassword = false;

  user: UserRegister = {
    name: '',
    first_surname: '',
    second_surname: '',
    email: '',
    password: '',
  };

  registerForm: FormGroup;
  touch: boolean = false;

  categories: Category[] = [];

  userInterests: UserInterest[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private projectService: ProjectService,
    public router: Router
  ) {
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
      firstLastName: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20),
        ],
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/),
        ],
      ],
      secondLastName: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20),
        ],
      ],
      confirmPassword: ['', Validators.required],
    });

    this.getCategories();
    this.getUserPreferences();
  }

  register() {
    if (this.registerForm.status != 'INVALID') {
      this.user.name = this.registerForm.get('name')?.value || '';
      this.user.first_surname =
        this.registerForm.get('firstLastName')?.value || '';
      this.user.second_surname =
        this.registerForm.get('secondLastName')?.value || '';
      this.user.email = this.registerForm.get('email')?.value || '';
      this.user.password = this.registerForm.get('password')?.value || '';

      this.authService.register(this.user).subscribe((response) => {
        this.router.navigate(['/login']);
      });
    } else {
      this.touch = true;
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  getCategories() {
    this.projectService
      .getCategories()
      .subscribe((response: CategoryGetResponse) => {
        this.categories = response.data.categories;
      });
  }

  getUserPreferences() {
    this.projectService
      .getUserPreferences()
      .subscribe((response: UserInterestGetResponse) => {
        if (response.success) {
          this.userInterests = response.data.userInterests;
        }
      });
  }

  hasCategory(category: Category, userPreferences: UserInterest[]) {
    for (let i = 0; i < userPreferences.length; i++) {
      if (userPreferences[i].category_id == category.category_id) {
        return true;
      }
    }

    return false;
  }

  toggleCategory() {}
}
