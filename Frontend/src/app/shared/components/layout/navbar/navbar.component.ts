import { Component, OnInit, Renderer2, ElementRef } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { AuthService } from '../../../../pages/auth/services/auth.service';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { MenuOption } from './menuoption.enum';

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  animations: [
    trigger('slideDown', [
      state(
        'hidden',
        style({
          opacity: 0,
          transform: 'translateY(-100%)',
        })
      ),
      state(
        'visible',
        style({
          opacity: 1,
          transform: 'translateY(0)',
        })
      ),
      transition('hidden => visible', animate('0.5s ease-in-out')),
      transition('visible => hidden', animate('0.5s ease-in-out')),
    ]),

    trigger('chevronAnimation', [
      state('collapsed', style({
        transform: 'rotate(0deg)'
      })),
      state('expanded', style({
        transform: 'rotate(180deg)'
      })),
      transition('expanded <=> collapsed', animate('300ms ease-in-out'))
    ])
    
  ],
  imports: [CommonModule, RouterLink, UserProfileComponent],
})
export class NavbarComponent implements OnInit {
  [x: string]: any;
  isMenuOpen: boolean = true;

  MenuOption = MenuOption;
  subMenuOpen: MenuOption = MenuOption.None;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private renderer: Renderer2,
    private el: ElementRef,
    public authService: AuthService
  ) {}

  ngOnInit() {
    // Cerrar el menú desplegable cuando la pantalla se expande más allá de 'lg'
    this.breakpointObserver.observe([Breakpoints.Large]).subscribe((result) => {
      if (result.matches) {
        this.closeMenu();
      }
    });

    // Cerrar el menú desplegable cuando la pantalla se reduce a un tamaño más pequeño
    this.breakpointObserver
      .observe([Breakpoints.Handset])
      .subscribe((result) => {
        if (result.matches) {
          this.closeMenu();
        }
      });

    this.renderer.listen('document', 'click', (event) => {
      if (!this.el.nativeElement.contains(event.target)) {
        this.closeMenu();
      }
    });
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    if (this.isMenuOpen) {
      this.isMenuOpen = false;
    }
  }

  toggleSubMenu(menu: MenuOption) {
    if (this.subMenuOpen === menu) {
      this.subMenuOpen = MenuOption.None;
    } else {
      this.subMenuOpen = menu;
    }
  }
}
