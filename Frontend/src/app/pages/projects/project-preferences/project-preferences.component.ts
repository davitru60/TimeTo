import { Component } from '@angular/core';
import { NavbarComponent } from "../../../shared/components/layout/navbar/navbar.component";

@Component({
    selector: 'app-project-preferences',
    standalone: true,
    templateUrl: './project-preferences.component.html',
    styleUrl: './project-preferences.component.scss',
    imports: [NavbarComponent]
})
export class ProjectPreferencesComponent {

}
