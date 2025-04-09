import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, interval, startWith, switchMap, tap } from 'rxjs';
import { projectRoutes } from '../../../../environments/environment.development';
import { ProjectImagesResponse } from '../../../core/interfaces/project.interface';

@Injectable({
  providedIn: 'root'
})
export class ProjectImagesService {
  private imageAddedSubject = new Subject<void>();
  private imageDeletedSubject = new Subject<void>();

  constructor(private http: HttpClient) { }

  getImages(){
    return this.http.get<any>(projectRoutes.getImages)
  }

  getProjectImages(projectId: number): Observable<ProjectImagesResponse> {
    return interval(5000).pipe(
      startWith(0),
      switchMap(() => this.http.get<ProjectImagesResponse>(projectRoutes.getProjectImages + projectId))
    );
  }

  addImageToProject(projectId: number, formData: FormData): Observable<any> {
    return this.http.post<any>(projectRoutes.addImageToProject(projectId), formData).pipe(
      tap((response) => {
        this.imageAddedSubject.next(response); // Notificar que se agregó una imagen
      })
    );
  }

  updateImageFromProject(projectId: number, formData: FormData): Observable<any> {
    return this.http.put<any>(projectRoutes.updateImageFromProject(projectId), formData);
  }

  deleteImage(projImgId: number): Observable<any> {
    return this.http.delete<any>(projectRoutes.deleteImage(projImgId)).pipe(
      tap(() => {
        this.imageDeletedSubject.next();
      })
    );
  }

  getProjectFromImages(projectId: number): Observable<ProjectImagesResponse> {
    return this.http.get<ProjectImagesResponse>(projectRoutes.getProjectImages + projectId);
  }

}
