import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, interval, startWith, switchMap, tap } from 'rxjs';
import { endpoints, environment, projectRoutes } from '../../../../environments/environment.development';
import { ProjectGet, ProjectImagesResponse, ImageOrderPut, EditorOrderPut, TextPut, TextPost, ProjectPut, CategoryGet, CategoryPost, CategoryPut } from '../interfaces/project.interface';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  private imageAddedSubject = new Subject<void>();
  private textEditSubject = new Subject<void> ()
  private imageDeletedSubject = new Subject<void>();

  constructor(private http: HttpClient) { }


  
  getAllProjects(): Observable<ProjectGet> {
    return interval(50000).pipe(
      startWith(0),
      switchMap(() => this.http.get<ProjectGet>(projectRoutes.getAllProjects))
    );
  }

  createProject(formData: FormData): Observable<any> {
    return this.http.post<any>(projectRoutes.createProject, formData);
  }

  updateProject(projectId: number,project:ProjectPut): Observable<any>{
    return this.http.put<any>(projectRoutes.updateProject(projectId),project)
  }

  deleteProject(projectId:number): Observable<any>{
    return this.http.delete<any>(projectRoutes.deleteProject(projectId))
  }

  getProjectCategories():Observable<CategoryGet>{
    return this.http.get<CategoryGet>(projectRoutes.getProjectCategories)
  }

  createProjectCategory(category:CategoryPost): Observable<any>{
    return this.http.post<any>(projectRoutes.createProjectCategory, category)
  }

  updateProjectCategory(categoryId:number,category:CategoryPut): Observable<any>{
    return this.http.put<any>(projectRoutes.updateProjectCategory(categoryId),category)
  }

  getProjectTexts(projectId: number): Observable<any> {
    return interval(3000).pipe(
      startWith(0),
      switchMap(() => this.http.get<any>(projectRoutes.getProjectTexts + projectId))
    );
  }

  getProjectFormTexts(projectId: number): Observable<any> {
    return this.http.get<any>(projectRoutes.getProjectTexts + projectId);
  }

  addProjectTexts(projectId: number, text: TextPost): Observable<any> {
    return this.http.post<any>(projectRoutes.addProjectTexts(projectId), text);
  }

  updateProjectTexts(projTextId: number, text: TextPut): Observable<any> {
    return this.http.put<any>(projectRoutes.updateProjectTexts(projTextId), text);
  }

  deleteProjectTexts(projTextId: number): Observable<any> {
    return this.http.delete<any>(projectRoutes.deleteProjectTexts(projTextId));
  }

  getProjectImages(projectId: number): Observable<ProjectImagesResponse> {
    return interval(3000).pipe(
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


  getProjectFormImages(projectId: number): Observable<ProjectImagesResponse> {
    return this.http.get<ProjectImagesResponse>(projectRoutes.getProjectImages + projectId);
  }

  
  updateImageOrder(projectId: number, imageOrder: ImageOrderPut): Observable<any> {
    return this.http.put<any>(projectRoutes.updateImageOrder(projectId), imageOrder);
  }

  updateEditorOrder(projectId: number, editorOrder: EditorOrderPut): Observable<any> {
    return this.http.put<any>(projectRoutes.updateEditorOrder(projectId), editorOrder).pipe(
      tap((response) => {
        this.textEditSubject.next(response);
      })
    );
  }

  deleteImage(projImgId: number): Observable<any> {
    return this.http.delete<any>(projectRoutes.deleteImage(projImgId)).pipe(
      tap(() => {
        this.imageDeletedSubject.next();
      })
    );
  }
}
