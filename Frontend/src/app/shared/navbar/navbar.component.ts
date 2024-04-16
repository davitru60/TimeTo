import { Component, OnInit, Renderer2, ElementRef } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit {
  [x: string]: any;
  isMenuOpen: boolean = true;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private renderer: Renderer2,
    private el: ElementRef
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
}
