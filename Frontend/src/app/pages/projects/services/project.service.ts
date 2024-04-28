import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProjectResponse } from '../interfaces/project.interface';
import { endpoints, environment, projectRoutes } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor(private http: HttpClient) { }

  getAllProjects(): Observable<ProjectResponse>{
    return this.http.get<ProjectResponse>(environment.baseUrl+endpoints.projectEndpoint+projectRoutes.getAllProjects)
  }

  uploadImage(projectId:number, formData:FormData):Observable<any>{
    return this.http.post<any>(environment.baseUrl+endpoints.projectEndpoint+projectRoutes.uploadImage+projectId, formData);
  }

  getProjectImages(projectId:number): Observable<any>{
    return this.http.get<any>(environment.baseUrl+endpoints.projectEndpoint+projectRoutes.getProjectImage+projectId)
  }
  
  getProjectTexts(projectId: number): Observable<any> {
    return this.http.get<any>(environment.baseUrl+endpoints.projectEndpoint+projectRoutes.getProjectTexts+projectId)
  }

}
