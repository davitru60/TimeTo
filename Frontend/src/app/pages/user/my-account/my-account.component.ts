import { Component } from '@angular/core';
import { NavbarComponent } from '../../../shared/components/layout/navbar/navbar.component';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../auth/services/auth.service';
import { UserRegister } from '../../../core/interfaces/auth.interface';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  Category,
  CategoryGetResponse,
} from '../../../core/interfaces/category.interface';
import { ProjectService } from '../../projects/services/project.service';
import { UserInterest, UserInterestDeleteResponse, UserInterestGetResponse, UserInterestPostResponse } from '../../../core/interfaces/user-preferences';
import { UserService } from '../service/user.service';
import { ToastService } from '../../../shared/components/ui/toast/toast.service';
import { ToastComponent } from "../../../shared/components/ui/toast/toast.component";


@Component({
    selector: 'app-my-account',
    standalone: true,
    templateUrl: './my-account.component.html',
    styleUrl: './my-account.component.scss',
    imports: [CommonModule, NavbarComponent, ReactiveFormsModule, ToastComponent]
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
    private userService: UserService,
    private toastService: ToastService,
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
    this.getUserInterests();
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

  getUserInterests() {
    this.userService
      .getUserInterests()
      .subscribe((response: UserInterestGetResponse) => {
        if (response.success) {
          this.userInterests = response.data.userInterests;
        }
      });
  }

  showSuccessToast(message: string) {
    this.toastService.showToast({ text: message, type: 'success' });
  }

  showErrorToast(message: string) {
    this.toastService.showToast({ text: message, type: 'error' });
  }

  hasCategory(category: Category, userInterests: UserInterest[]) {
    for (let i = 0; i < userInterests.length; i++) {
      if (userInterests[i].category_id == category.category_id) {
        return true;
      }
    }

    return false;
  }

  toggleCategory(category:Category) {
    const index = this.userInterests.findIndex(
      (userInterest) => userInterest.category_id == category.category_id
    )

    if (index !== -1) {
      this.deleteUserInterest(category)
    }else{
      this.addUserInterest(category)
    }
  }

  addUserInterest(category:Category){
    const index = this.userInterests.findIndex(
      (userInterest) => userInterest.category_id == category.category_id
    )

    if(index === -1){
      const newUserInterest:UserInterest = {
        user_int_id: 0,
        user_id: 0,
        category_id: category.category_id
      }

      this.userInterests.push(newUserInterest)

      this.userService.addUserInterest(newUserInterest).subscribe((response:UserInterestPostResponse)=>{
        if(response.success){
          this.showSuccessToast('Interés añadido correctamente');
        }else{
          this.showErrorToast('Error al añadir el interés');
        }
      })
    }

  }

  
  deleteUserInterest(category:Category){
    const index = this.userInterests.findIndex(
      (userInterest) => userInterest.category_id == category.category_id
    )

    if (index !== -1) {
      const userInterest = this.userInterests[index]
      this.userInterests.splice(index,1)
      this.userService.deleteUserInterest(userInterest.user_int_id).subscribe((response:UserInterestDeleteResponse)=>{
        if(response.success){
          this.showSuccessToast('Interés eliminado correctamente');
        }
      })

  }

}
}
