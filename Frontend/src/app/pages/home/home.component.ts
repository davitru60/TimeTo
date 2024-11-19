import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../../shared/components/layout/navbar/navbar.component';
import { TestimonialsComponent } from "./testimonials/testimonials.component";
import { LatestProjectsComponent } from "./latest-projects/latest-projects.component";
import { FooterComponent } from "../../shared/components/layout/footer/footer.component";

@Component({
    selector: 'app-home',
    standalone: true,
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss',
    imports: [CommonModule, RouterLink, NavbarComponent, TestimonialsComponent, LatestProjectsComponent, FooterComponent]
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

  selectedContent: string = 'estrategia';

  selectContent(content: string) {
    this.selectedContent = content;
  }

  
}
