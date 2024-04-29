import { Component } from '@angular/core';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import { ProjectFormComponent } from '../project-form/project-form.component';
import { CommonModule } from '@angular/common';
import { ProjectService } from '../services/project.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { combineLatest, filter, map } from 'rxjs';
import { ProjectImagesResponse } from '../interfaces/project.interface';


@Component({
  selector: 'app-single-project',
  standalone: true,
  templateUrl: './single-project.component.html',
  styleUrl: './single-project.component.scss',
  imports: [CommonModule, NavbarComponent, ProjectFormComponent],
})
export class SingleProjectComponent {
  isEditMode = false;
  projectId: number = 0;

  fields: any[] = [];
  
  constructor(
    private projectService: ProjectService,
    private route: ActivatedRoute,
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
    const imagesObservable = this.getImagesObservable(projectId);
    const textsObservable = this.getTextsObservable(projectId);

    // Usa `combineLatest` para esperar ambos resultados
    combineLatest([imagesObservable, textsObservable]).subscribe(
      ([images, texts]) => {
        this.fields = this.combineAndSortFields(images, texts);
        console.log(this.fields)

      },
      (error) => {
        console.error("Error al combinar datos:", error);
      }
    );
  }

  getImagesObservable(projectId: number) {
    return this.projectService.getProjectImages(projectId).pipe(
      map((response:ProjectImagesResponse) => {
        if (response.success) {
          return response.data.images;
          
        } else {
          throw new Error("Error al obtener imágenes");
        }
      })
    );
  }

  getTextsObservable(projectId: number) {
    return this.projectService.getProjectTexts(projectId).pipe(
      map((response) => {
        if (response.success) {
          return response.data.texts;
        } else {
          throw new Error("Error al obtener textos");
        }
      })
    );
  }

  combineAndSortFields(images: any[], texts: any[]) {
    if (!Array.isArray(images) || !Array.isArray(texts)) {
      console.error("Error: Los datos no son arrays.");
      return [];
    }

    // Combina y ordena por `index`
    const combinedFields = [...images, ...texts].sort((a, b) => a.index - b.index);
    return combinedFields;
  }
}