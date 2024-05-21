import { Component, HostListener } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { animate, style, transition, trigger } from '@angular/animations';
import { ModalComponent } from '../../../ui/modal/modal.component';
import { AddProjectComponent } from '../../../../../pages/projects/add-project/add-project.component';
import { LoaderComponent } from '../../../ui/loader/loader.component';
import { AuthService } from '../../../../../pages/auth/services/auth.service';


@Component({
    selector: 'app-user-profile',
    standalone: true,
    templateUrl: './user-profile.component.html',
    styleUrl: './user-profile.component.scss',
    animations: [
        trigger('fadeInOut', [
            transition(':enter', [
                style({ opacity: 0 }),
                animate('150ms', style({ opacity: 1 }))
            ]),
            transition(':leave', [
                animate('200ms', style({ opacity: 0 }))
            ])
        ])
    ],
    imports: [CommonModule, RouterLink, ModalComponent, AddProjectComponent, LoaderComponent]
})



export class UserProfileComponent {
  isDropdownOpen = false;
  isLoading = false;
  isModalOpen = false;

  constructor(private router: Router, public authService:AuthService) {}

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }


  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  logout() {
    this.isLoading = true;
  
  
    if(this.authService.logout()){
      setTimeout(() => {
        this.isDropdownOpen = false;
        this.isLoading = false;
        this.router.navigate(['']); 
        window.location.reload()
      }, 2000); 
    }

    
  }
  

  //Closes profile dropdown clicking on any part of the page
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const dropdownElement = document.getElementById('dropdown-menu');
    if (dropdownElement && !dropdownElement.contains(event.target as Node)) {
      this.isDropdownOpen = false;
    }
  }
 
   //Closes profile dropdown clicking on the escape key
   @HostListener('document:keydown.escape', ['$event'])
   onEscapePress(event: KeyboardEvent) {
     this.isDropdownOpen = false; 
   }

   
}
