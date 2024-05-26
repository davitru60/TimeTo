import { Component } from '@angular/core';
import { NavbarComponent } from '../../../shared/components/layout/navbar/navbar.component';
import { ProjectFormComponent } from '../project-form/project-form.component';
import { CommonModule } from '@angular/common';
import { ProjectService } from '../services/project.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { combineLatest, filter, map } from 'rxjs';
import { ProjectImagesResponse } from '../interfaces/project.interface';
import { GoogleAuthComponent } from "../../auth/login/google-auth/google-auth.component";
import { AngularSplitModule } from 'angular-split';
import { AuthService } from '../../auth/services/auth.service';
import { ProjectLoaderService } from '../services/project-loader.service';


@Component({
    selector: 'app-single-project',
    standalone: true,
    templateUrl: './single-project.component.html',
    styleUrl: './single-project.component.scss',
    imports: [CommonModule, NavbarComponent, ProjectFormComponent, GoogleAuthComponent,AngularSplitModule]
})
export class SingleProjectComponent {
  isEditMode = false;
  projectId: number = 0;

  fields: any[] = [];
  
  constructor(
    private projectService: ProjectService,
    public authService: AuthService,
    private route: ActivatedRoute,
    private projectLoaderService: ProjectLoaderService,
    private router: Router
  ) {
    this.router.events
      .pipe(filter((event: any) => event instanceof NavigationEnd))
      .subscribe(() => {
        window.scrollTo(0, 0);
        this.projectId = this.route.snapshot.params['id'];
        this.loadProjectData(this.projectId);
      });
  }

  toggleEditMode(): void {
    this.isEditMode = !this.isEditMode;
  }

  loadProjectData(projectId: number): void {
    const imagesObservable = this.projectLoaderService.getImagesObservable(projectId)
    const textsObservable = this.projectLoaderService.getTextsObservable(projectId)

    // Usa `combineLatest` para esperar ambos resultados
    combineLatest([imagesObservable, textsObservable]).subscribe(
      ([images, texts]) => {
        this.fields = this.projectLoaderService.combineAndSortFields(images,texts)
      

      },
      (error) => {
        console.error("Error al combinar datos:", error);
      }
    );
  }
}
