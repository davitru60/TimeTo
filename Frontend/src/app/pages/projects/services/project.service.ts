import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, interval, startWith, switchMap, tap } from 'rxjs';
import { endpoints, environment, projectRoutes } from '../../../../environments/environment.development';
import { ProjectGet, ProjectImagesResponse, ImageOrderPut, EditorOrderPut } from '../interfaces/project.interface';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  private imageAddedSubject = new Subject<void>();
  private imageDeletedSubject = new Subject<void>();

  constructor(private http: HttpClient) { }


  getAllProjects(): Observable<ProjectGet> {
    return interval(5000).pipe(
      startWith(0),
      switchMap(() => this.http.get<ProjectGet>(environment.baseUrl + endpoints.projectEndpoint + projectRoutes.getAllProjects))
    );
  }

  createProject(formData: FormData): Observable<any> {
    return this.http.post<any>(environment.baseUrl + endpoints.projectEndpoint + projectRoutes.createProject, formData);
  }

  addImageToProject(projectId: number, formData: FormData): Observable<any> {
    return this.http.post<any>(environment.baseUrl + endpoints.projectEndpoint + projectRoutes.addImageToProject + projectId, formData).pipe(
      tap((response) => {
        this.imageAddedSubject.next(response); // Notificar que se agregó una imagen
      })
    );
  }

  getProjectImages(projectId: number): Observable<ProjectImagesResponse> {
    return interval(3000).pipe( 
      startWith(0),
      switchMap(() => this.http.get<ProjectImagesResponse>(environment.baseUrl + endpoints.projectEndpoint + projectRoutes.getProjectImages + projectId))
    );
  }

  getProjectFormImages(projectId: number): Observable<ProjectImagesResponse> {
    return this.http.get<ProjectImagesResponse>(environment.baseUrl + endpoints.projectEndpoint + projectRoutes.getProjectImages + projectId);
  }

  getProjectTexts(projectId: number): Observable<any> {
    return this.http.get<any>(environment.baseUrl + endpoints.projectEndpoint + projectRoutes.getProjectTexts + projectId);
  }

  addEditor(projectId: number, formData: FormData): Observable<any> {
    return this.http.post<any>(environment.baseUrl + endpoints.projectEndpoint + projectRoutes.addProjectEditor + projectId, formData);
  }

  updateImageOrder(projectId: number, imageOrder: ImageOrderPut): Observable<any> {
    return this.http.put<any>(environment.baseUrl + endpoints.projectEndpoint + projectRoutes.updateImageOrder + projectId, imageOrder);
  }

  updateEditorOrder(projectId: number, editorOrder: EditorOrderPut): Observable<any> {
    return this.http.put<any>(environment.baseUrl + endpoints.projectEndpoint + projectRoutes.updateEditorOrder + projectId, editorOrder);
  }

  deleteImage(projImgId: number){
    return this.http.delete<any>(environment.baseUrl + endpoints.projectEndpoint + projectRoutes.deleteImage + projImgId).pipe(
      tap(() => {
        this.imageDeletedSubject.next();
      })
    );
  }
}
