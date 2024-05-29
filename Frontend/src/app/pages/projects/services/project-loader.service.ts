import { Injectable } from '@angular/core';
import { ProjectService } from './project.service';
import { map } from 'rxjs';
import { FormFields } from '../../../core/interfaces/project.interface';

@Injectable({
  providedIn: 'root',
})
export class ProjectLoaderService {
  constructor(private projectService: ProjectService) {}


  getImagesObservable(projectId: number) {
    return this.projectService.getProjectFormImages(projectId).pipe(
      map((response) => {
        if (response.success) {
          return response.data.images;
        } else {
          throw new Error('Error al obtener imágenes');
        }
      })
    );
  }

  getTextsObservable(projectId: number) {
    return this.projectService.getProjectFormTexts(projectId).pipe(
      map((response) => {
        if (response.success) {
          return response.data.texts;
        } else {
          throw new Error('Error al obtener textos');
        }
      })
    );
  }

  combineAndSortFields(images: any[], texts: any[]): FormFields[] {
    if (!Array.isArray(images) || !Array.isArray(texts)) {
      console.error('Error: Los datos no son arrays.');
      return [];
    }

    const combinedFields = [...images, ...texts].sort(
      (a, b) => a.index - b.index
    );
    return combinedFields;
  }
}
