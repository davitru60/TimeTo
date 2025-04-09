import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
    ProjectCategoryDeleteResponse,
    ProjectCategoryGetResponse,
    ProjectCategoryPostData,
    ProjectCategoryPostResponse
} from '../../../core/interfaces/project-category.interface';
import { ProjectCategoryService } from '../services/project-category.service';

@Injectable({
    providedIn: 'root',
})
export class ProjectCategoryFacade {
    constructor(private projectCategoryService: ProjectCategoryService) { }

    getProjectCategories(projectId: number): Observable<ProjectCategoryGetResponse> {
        return this.projectCategoryService.getProjectCategories(projectId);
    }

    addProjectCategory(projectCategory: ProjectCategoryPostData): Observable<ProjectCategoryPostResponse> {
        return this.projectCategoryService.addProjectCategory(projectCategory);
    }

    deleteProjectCategory(projCatId: number): Observable<ProjectCategoryDeleteResponse> {
        return this.projectCategoryService.deleteProjectCategory(projCatId);
    }
}
