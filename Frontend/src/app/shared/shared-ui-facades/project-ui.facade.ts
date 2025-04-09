import { Injectable } from "@angular/core";
import { ProjectService } from "../../pages/projects/services/project.service";
import { ToastFacade } from "../components/ui/toast/toast.facade";
import { ProjectDeleteResponse, ProjectPutResponse } from "../../core/interfaces/project.interface";
import { InfoProjectToastMessages } from "../components/ui/toast/toastMessages";


@Injectable({
  providedIn: 'root'
})
export class ProjectUIFacade {
  constructor(
    private projectService: ProjectService,
    private toastFacade: ToastFacade
  ) { }

  updateProject(projectId: number,
    selectedProject: any,
    selectedImage: any,
    closeModalCallback: Function,
    getAllProjectsCallback: Function
  ): void {
    if (selectedProject) {
      selectedProject.path = selectedImage;

      const formData = new FormData();
      formData.append('name', selectedProject.name);
      formData.append('description', selectedProject.description);

      if (selectedImage) {
        formData.append('path', selectedProject.path);
      }

      this.projectService.updateProject(projectId, formData).subscribe({
        next: (response: ProjectPutResponse) => {
          if (response.success) {
            this.toastFacade.showSuccessToast('Proyecto actualizado exitosamente');
            closeModalCallback(projectId);
            selectedImage = '';
            getAllProjectsCallback();
          }
        },
        error: (error: any) => {
          this.toastFacade.showErrorToast('Error al actualizar el proyecto');
        },
      });
    }
  }

  deleteProject(projectId: number, getAllProjectsCallback: Function): void {
      this.projectService.deleteProject(projectId).subscribe({
        next: (response: ProjectDeleteResponse) => {
          if (response.success) {
            this.toastFacade.showInfoToast(
              InfoProjectToastMessages.PROJECT_DELETE_MESSAGE
            );
            setTimeout(() => {
              this.toastFacade.showInfoToast(
                InfoProjectToastMessages.PROJECT_DELETE_MESSAGE
              );
              getAllProjectsCallback();
            }, 2000);
          }
        },
        error: (error: ProjectDeleteResponse) => {
          this.toastFacade.showErrorToast(
            `Error al eliminar el proyecto: ${error.msg || error}`
          );
        },
      });
    }


}
