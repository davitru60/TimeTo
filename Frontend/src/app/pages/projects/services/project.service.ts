import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EditorOrderPut, ImageOrderPut, ProjectImagesResponse, ProjectGet } from '../interfaces/project.interface';
import { endpoints, environment, projectRoutes } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor(private http: HttpClient) { }

  getAllProjects(): Observable<ProjectGet>{
    return this.http.get<ProjectGet>(environment.baseUrl+endpoints.projectEndpoint+projectRoutes.getAllProjects)
  }

  createProject(formData:FormData){
    return this.http.post<any>(environment.baseUrl+endpoints.projectEndpoint+projectRoutes.createProject,formData)
  }

  addImageToProject(projectId:number, formData:FormData):Observable<any>{
    return this.http.post<any>(environment.baseUrl+endpoints.projectEndpoint+projectRoutes.addImageToProject+projectId, formData);
  }

  getProjectImages(projectId:number): Observable<ProjectImagesResponse>{
    return this.http.get<ProjectImagesResponse>(environment.baseUrl+endpoints.projectEndpoint+projectRoutes.getProjectImages+projectId)
  }
  
  getProjectTexts(projectId: number): Observable<any> {
    return this.http.get<any>(environment.baseUrl+endpoints.projectEndpoint+projectRoutes.getProjectTexts+projectId)
  }

  updateImageOrder(projectId:number,imageOrder:ImageOrderPut){
    return this.http.put<any>(environment.baseUrl+endpoints.projectEndpoint+projectRoutes.updateImageOrder+projectId,imageOrder)
  }

  updateEditorOrder(projectId:number,editorOrder:EditorOrderPut){
    return this.http.put<any> (environment.baseUrl + endpoints.projectEndpoint+projectRoutes.updateEditorOrder+projectId,editorOrder)
  }

  deleteImage(projImgId:number){
    return this.http.delete<any>(environment.baseUrl+ endpoints.projectEndpoint+projectRoutes.deleteImage+projImgId)
  }

}
