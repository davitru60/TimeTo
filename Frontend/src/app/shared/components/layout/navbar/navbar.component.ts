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
  styleUrls: ['./navbar.component.scss'], 
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
  isMenuOpen: boolean = false; // inicia cerrado

  MenuOption = MenuOption;
  subMenuOpen: MenuOption = MenuOption.None;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private renderer: Renderer2,
    private el: ElementRef,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.breakpointObserver
      .observe([Breakpoints.Large, Breakpoints.Handset, Breakpoints.Tablet])
      .subscribe(result => {
        if (result.matches) {
          if (result.breakpoints[Breakpoints.Large]) {
            // En pantallas grandes cerramos menú
            this.isMenuOpen = false;
          } else if (
            result.breakpoints[Breakpoints.Handset] ||
            result.breakpoints[Breakpoints.Tablet]
          ) {
            // En móviles y tablets lo cerramos también por defecto
            this.isMenuOpen = false;
          }
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

  // Método opcional para saber si estamos en móvil/tablet
  isMobile(): boolean {
    return (
      this.breakpointObserver.isMatched(Breakpoints.Handset) ||
      this.breakpointObserver.isMatched(Breakpoints.Tablet)
    );
  }
}
