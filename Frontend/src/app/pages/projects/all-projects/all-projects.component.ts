import { Component, ViewChild } from '@angular/core';
import { NavbarComponent } from '../../../shared/components/layout/navbar/navbar.component';
import { ProjectService } from '../services/project.service';
import { Project, ProjectGetResponse, ProjectPutData} from '../../../core/interfaces/project.interface';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { PaginationComponent } from '../../../shared/components/ui/pagination/pagination.component';
import { ModalComponent } from './../../../shared/components/ui/modal/modal.component';
import { FormsModule, NgForm } from '@angular/forms';
import { ToastService } from '../../../shared/components/ui/toast/toast.service';
import { ToastComponent } from '../../../shared/components/ui/toast/toast.component';
import { LoaderComponent } from "../../../shared/components/ui/loader/loader.component";
import { AuthService } from '../../auth/services/auth.service';




@Component({
    selector: 'app-all-projects',
    standalone: true,
    templateUrl: './all-projects.component.html',
    styleUrl: './all-projects.component.scss',
    imports: [CommonModule, NavbarComponent, RouterLink, NgxPaginationModule, FormsModule, PaginationComponent, ModalComponent, ToastComponent, LoaderComponent]
})

export class AllProjectsComponent {
  projects: Project[] = [];
  selectedProject: Project | null = null;

  currentPage = 1;
  itemsPerPage = 4;
  isModalOpen: boolean [] = []
  isLoading = false;

  project: ProjectPutData = {
    name: '',
    description: '',
    path: ''
  }


  @ViewChild('f', { static: false }) projectForm!: NgForm;

  constructor(
    private projectService: ProjectService, 
    private toastService: ToastService,
    public authService: AuthService
  
  ) {
    this.getAllProjects();
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

  get totalPages(): number {
    return Math.ceil(this.projects.length / this.itemsPerPage);
  }

  get paginatedProjects(): Project[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = this.currentPage * this.itemsPerPage;
    return this.projects.slice(startIndex, endIndex);
  }

  onPageChange(newPage: number) {
    this.currentPage = newPage;
  }

  onItemsPerPageChange(newItemsPerPage: number) {
    this.itemsPerPage = newItemsPerPage;
    this.currentPage = 1;
  }

  
  openModal(index:number){
    this.selectedProject = this.projects.find(project => project.project_id === index) || null;
    this.isModalOpen[index]= true
  }

  closeModal(index:number){
    this.isModalOpen[index] = false
  }

  getAllProjects() {
    this.projectService
      .getAllProjects()
      .subscribe((response: ProjectGetResponse) => {
        if(response.success){
          this.projects = response.data.projects;

        }
      });
  }


  updateProject(projectId: number) {
    if (this.selectedProject) {
      this.project.name = this.selectedProject.name;
      this.project.description = this.selectedProject.description;

      this.projectService.updateProject(this.selectedProject.project_id, this.project).subscribe(
        (response: any) => {
          this.showSuccessToast('Proyecto actualizado exitosamente');
          this.closeModal(projectId);
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
