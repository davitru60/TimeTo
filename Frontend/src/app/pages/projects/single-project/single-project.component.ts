import { Component } from '@angular/core';
import { NavbarComponent } from "../../../shared/navbar/navbar.component";
import { DynamicComponent } from "../../components/dynamic/dynamic.component";

@Component({
    selector: 'app-single-project',
    standalone: true,
    templateUrl: './single-project.component.html',
    styleUrl: './single-project.component.scss',
    imports: [NavbarComponent, DynamicComponent]
})
export class SingleProjectComponent {

}
