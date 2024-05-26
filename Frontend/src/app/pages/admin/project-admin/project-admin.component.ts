import { Component } from '@angular/core';
import { NavbarComponent } from '../../../shared/components/layout/navbar/navbar.component';
import { ProjectService } from '../../projects/services/project.service';
import {
  Project,
  ProjectGet,
  ProjectPut,
} from '../../projects/interfaces/project.interface';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../shared/components/ui/toast/toast.service';
import { FormsModule } from '@angular/forms';
import { ModalComponent } from "../../../shared/components/ui/modal/modal.component";
import { ToastComponent } from "../../../shared/components/ui/toast/toast.component";
import { PaginationComponent } from "../../../shared/components/ui/pagination/pagination.component";
import { AddProjectComponent } from "../../projects/add-project/add-project.component";

@Component({
    selector: 'app-project-admin',
    standalone: true,
    templateUrl: './project-admin.component.html',
    styleUrl: './project-admin.component.scss',
    imports: [CommonModule, NavbarComponent, FormsModule, ModalComponent, ToastComponent, PaginationComponent, AddProjectComponent]
})
export class ProjectAdminComponent {
  projects: Project[] = [];
  isEditProjectModalOpen: boolean[] = [];
  isAddProjectModalOpen = false
  selectedProject: Project | null = null;

  project: ProjectPut = {
    name: '',
    description: '',
    path: ''
  }


  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 0;

  constructor(
    private projectService: ProjectService,
    private toastService: ToastService
  ) {
    this.getAllProjects();
  }

  get paginatedProjects() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.projects.slice(startIndex, endIndex);
  }

  onPageChange(newPage: number) {
    this.currentPage = newPage;
  }

  onItemsPerPageChange(newItemsPerPage: number) {
    this.itemsPerPage = newItemsPerPage;
    this.currentPage = 1;
  }

  openEditProjectModal(index: number) {
    this.isEditProjectModalOpen[index] = true;
    this.selectedProject = this.projects[index];
  }

  closeEditProjectModal(index: number) {
    this.isEditProjectModalOpen[index] = false;
    this.selectedProject = null;
  }

  openAddProjectModal() {
    this.isAddProjectModalOpen = true;
  }

  closeAddProjectModal() {
    this.isAddProjectModalOpen = false;
  }

  showSuccessToast(message: string) {
    this.toastService.showToast({ text: message, type: 'success' });
  }

  showErrorToast(message: string) {
    this.toastService.showToast({ text: message, type: 'error' });
  }

  showInfoToast(message: string) {
    this.toastService.showToast({ text: message, type: 'info' });
  }

  showWarningToast(message: string) {
    this.toastService.showToast({ text: message, type: 'warning' });
  }

  getAllProjects() {
    this.projectService.getAllProjects().subscribe((response: ProjectGet) => {
      this.projects = response.data.projects;
      this.totalPages = Math.ceil(this.projects.length / this.itemsPerPage);
      // Inicializamos isModalOpen con valores false para cada proyecto
      this.isEditProjectModalOpen = new Array(this.projects.length).fill(false);
    });
  }

  updateProject(projectId: number) {
    if (this.selectedProject) {
      const projectData: ProjectPut = {
        name: this.selectedProject.name,
        description: this.selectedProject.description,
        path: this.selectedProject.path
      };

      this.projectService.updateProject(projectId, projectData).subscribe(
        (response: any) => {
          this.showSuccessToast('Proyecto actualizado exitosamente');
          this.closeEditProjectModal(projectId);
          this.getAllProjects(); // Refrescar la lista de proyectos después de la actualización
        },
        (error: any) => {
          this.showErrorToast('Error al actualizar el proyecto');
        }
      );
    }
  }

  deleteProject(projectId: number) {
    this.projectService.deleteProject(projectId).subscribe(
      (response: any) => {
        this.showInfoToast('Eliminación del proyecto en progreso...');
        setTimeout(() => {
          this.showSuccessToast('Proyecto eliminado exitosamente');
          this.getAllProjects(); // Refrescar la lista de proyectos después de la eliminación
        }, 2000);
      },
      (error: any) => {
        this.showErrorToast(`Error al eliminar el proyecto: ${error.message || error}`);
      }
    );
  }
}
