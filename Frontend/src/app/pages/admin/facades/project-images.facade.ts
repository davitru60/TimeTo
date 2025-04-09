import { Injectable } from "@angular/core";
import { ProjectImagesService } from "../services/project-images.service";
import { Observable } from "rxjs";
import { ProjectImagesResponse } from "../../../core/interfaces/project.interface";

@Injectable({
    providedIn: 'root',
})

export class ProjectImagesFacade {
    constructor(private projectImagesService: ProjectImagesService) { }

    getImages(): Observable<any> {
        return this.projectImagesService.getImages();
    }

    getProjectImages(projectId: number): Observable<ProjectImagesResponse> {
        return this.projectImagesService.getProjectImages(projectId);
    }

    addImageToProject(projectId: number, formData: FormData): Observable<any> {
        return this.projectImagesService.addImageToProject(projectId, formData);
    }

    updateImageFromProject(projectId: number, formData: FormData): Observable<any> {
        return this.projectImagesService.updateImageFromProject(projectId, formData);
    }

    deleteImage(projImgId: number): Observable<any> {
        return this.projectImagesService.deleteImage(projImgId);
    }

    getProjectFromImages(projectId: number): Observable<ProjectImagesResponse> {
        return this.projectImagesService.getProjectFromImages(projectId);
    }
}