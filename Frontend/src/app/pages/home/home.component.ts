import { CommonModule } from '@angular/common';
import { Component, HostListener} from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../../shared/components/layout/navbar/navbar.component';

@Component({
    selector: 'app-home',
    standalone: true,
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss',
    imports: [CommonModule, RouterLink, NavbarComponent]
})
export class HomeComponent {
    isSmallScreen = false;
    isMediumScreen = false;
    isLargeScreen = false;
  
    @HostListener('window:resize', ['$event'])
    onResize(event: any) {
      this.checkScreenSize();
    }
  
    constructor() {
      this.checkScreenSize();
    }
  
    private checkScreenSize() {
      const width = window.innerWidth;
      this.isSmallScreen = width < 768;
      this.isMediumScreen = width >= 768 && width < 1280;
      this.isLargeScreen = width >= 1260;
    }
  }