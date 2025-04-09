import { Component } from '@angular/core';
import { NavbarComponent } from "../../../shared/components/layout/navbar/navbar.component";
import { ProjectAdminComponent } from "../project-admin/project-admin.component";
import { CategoryAdminComponent } from "../category-admin/category-admin.component";

@Component({
    selector: 'app-administration',
    standalone: true,
    templateUrl: './administration.component.html',
    styleUrl: './administration.component.scss',
    imports: [NavbarComponent, ProjectAdminComponent, CategoryAdminComponent]
})
export class AdministrationComponent {

}
