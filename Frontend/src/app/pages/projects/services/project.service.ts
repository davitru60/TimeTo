import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, interval, startWith, switchMap, tap } from 'rxjs';
import { projectRoutes } from '../../../../environments/environment.development';
import { ProjectGetResponse, ProjectImagesResponse, ImageOrderPut, EditorOrderPut, ProjectPutResponse, ProjectDeleteResponse } from '../../../core/interfaces/project.interface';
import { TextPutData, TextPostData } from '../../../core/interfaces/project-text.interface';
import { ProjectCategoryDeleteResponse, ProjectCategoryPostData, ProjectCategoryPostResponse } from '../../../core/interfaces/project-category.interface';
import { CategoryGetResponse, CategoryPostData ,CategoryPutResponse,CategoryPutData, CategoryPostResponse } from '../../../core/interfaces/category.interface';
import { ProjectCategoryGetResponse } from '../../../core/interfaces/project-category.interface';


@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private imageAddedSubject = new Subject<void>();
  private textEditSubject = new Subject<void> ()
  private imageDeletedSubject = new Subject<void>();

  constructor(private http: HttpClient) { }
  
  getAllProjects(): Observable<ProjectGetResponse> {
    return interval(30000).pipe(
      startWith(0),
      switchMap(() => this.http.get<ProjectGetResponse>(projectRoutes.getAllProjects))
    );
  }

  getRecommendedProjects(): Observable<any>{
    return this.http.get<any>(projectRoutes.getRecommendedProjects,{params:{auth:'true'}});
  }

  createProject(formData: FormData): Observable<CategoryPostResponse> {
    return this.http.post<CategoryPostResponse>(projectRoutes.createProject, formData);
  }

  updateProject(projectId: number,formData:FormData): Observable<ProjectPutResponse>{
    return this.http.put<ProjectPutResponse>(projectRoutes.updateProject(projectId),formData)
  }

  updateProjectHomeImage(projectId: number,formData:FormData): Observable<ProjectPutResponse>{
    return this.http.put<ProjectPutResponse>(projectRoutes.updateProjectHomeImage(projectId),formData)
  }

  deleteProject(projectId:number): Observable<ProjectDeleteResponse>{
    return this.http.delete<ProjectDeleteResponse>(projectRoutes.deleteProject(projectId))
  }

  getCategories():Observable<CategoryGetResponse>{
    return this.http.get<CategoryGetResponse>(projectRoutes.getCategories,{params:{auth:'true'}})
  }


  createCategory(category:CategoryPostData): Observable<CategoryPostResponse>{
    return this.http.post<CategoryPostResponse>(projectRoutes.createCategory, category)
  }

  updateCategory(categoryId:number,category:CategoryPutData): Observable<CategoryPutResponse>{
    return this.http.put<CategoryPutResponse>(projectRoutes.updateCategory(categoryId),category)
  }

  deleteCategory(categoryId:number):Observable<any>{
    return this.http.delete<any>(projectRoutes.deleteCategory(categoryId))
  }

  getProjectCategories(projectId:number): Observable<ProjectCategoryGetResponse>{
    return this.http.get<ProjectCategoryGetResponse>(projectRoutes.getProjectCategories(projectId))
  }

  addProjectCategory(projectCategory:ProjectCategoryPostData):Observable<ProjectCategoryPostResponse>{
    return this.http.post<ProjectCategoryPostResponse>(projectRoutes.addProjectCategory,projectCategory)
  }

  deleteProjectCategory(projCatId:number):Observable<ProjectCategoryDeleteResponse>{
    return this.http.delete<ProjectCategoryDeleteResponse>(projectRoutes.deleteProjectCategory(projCatId))
  }

  getProjectTexts(projectId: number): Observable<any> {
    return interval(5000).pipe(
      startWith(0),
      switchMap(() => this.http.get<any>(projectRoutes.getProjectTexts + projectId))
    );
  }

  getProjectFormTexts(projectId: number): Observable<any> {
    return this.http.get<any>(projectRoutes.getProjectTexts + projectId);
  }

  addProjectTexts(projectId: number, text: TextPostData): Observable<any> {
    return this.http.post<any>(projectRoutes.addProjectTexts(projectId), text);
  }

  updateProjectTexts(projTextId: number, text: TextPutData): Observable<any> {
    return this.http.put<any>(projectRoutes.updateProjectTexts(projTextId), text);
  }

  
  deleteProjectTexts(projTextId: number): Observable<any> {
    return this.http.delete<any>(projectRoutes.deleteProjectTexts(projTextId));
  }

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

  updateImageFromProject(projectId:number,formData:FormData):Observable<any>{
    return this.http.put<any>(projectRoutes.updateImageFromProject(projectId),formData);
  }

  deleteImage(projImgId: number): Observable<any> {
    return this.http.delete<any>(projectRoutes.deleteImage(projImgId)).pipe(
      tap(() => {
        this.imageDeletedSubject.next();
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

 
}
