import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { projectRoutes } from '../../../../environments/environment.development';
import { ProjectCategoryGetResponse, ProjectCategoryPostData, ProjectCategoryPostResponse, ProjectCategoryDeleteResponse } from '../../../core/interfaces/project-category.interface';

@Injectable({
  providedIn: 'root'
})
export class ProjectCategoryService {

  constructor(private http: HttpClient) { }

  getProjectCategories(projectId: number): Observable<ProjectCategoryGetResponse> {
    return this.http.get<ProjectCategoryGetResponse>(projectRoutes.getProjectCategories(projectId))
  }

  addProjectCategory(projectCategory: ProjectCategoryPostData): Observable<ProjectCategoryPostResponse> {
    return this.http.post<ProjectCategoryPostResponse>(projectRoutes.addProjectCategory, projectCategory)
  }

  deleteProjectCategory(projCatId: number): Observable<ProjectCategoryDeleteResponse> {
    return this.http.delete<ProjectCategoryDeleteResponse>(projectRoutes.deleteProjectCategory(projCatId))
  }

}
