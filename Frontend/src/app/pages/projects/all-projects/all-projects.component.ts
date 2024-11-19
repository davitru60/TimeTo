import { Component } from '@angular/core';
import { NavbarComponent } from '../../../shared/components/layout/navbar/navbar.component';
import { ProjectService } from '../services/project.service';
import {
  Project,
  ProjectGetResponse,
  ProjectPutData,
  ProjectPutResponse,
} from '../../../core/interfaces/project.interface';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { PaginationComponent } from '../../../shared/components/ui/pagination/pagination.component';
import { ModalComponent } from './../../../shared/components/ui/modal/modal.component';
import { FormsModule, NgForm } from '@angular/forms';
import { ToastService } from '../../../shared/components/ui/toast/toast.service';
import { ToastComponent } from '../../../shared/components/ui/toast/toast.component';
import { LoaderComponent } from '../../../shared/components/ui/loader/loader.component';
import { AuthService } from '../../auth/services/auth.service';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';

@Component({
  selector: 'app-all-projects',
  standalone: true,
  templateUrl: './all-projects.component.html',
  styleUrl: './all-projects.component.scss',
  imports: [
    CommonModule,
    NavbarComponent,
    RouterLink,
    NgxPaginationModule,
    FormsModule,
    PaginationComponent,
    ModalComponent,
    ToastComponent,
    LoaderComponent,
    ButtonComponent,
  ],
})
export class AllProjectsComponent {
  projects: Project[] = [];
  images: any [] = []
  selectedProject: Project | null = null;

  currentPage = 1;
  itemsPerPage = 4;
  isModalOpen: boolean[] = [];
  isDeleteModalOpen: boolean[] = [];
  isImageModalOpen: boolean[] = [];
  isLoading = false;
  isDropdownOpen = false;

  project: ProjectPutData = {
    name: '',
    description: '',
    path: '',
  };

  deleteModalStyle = 'lg:w-1/3';
  imageModalStyle = 'lg:w-1/2';

  imageOption: string = '';

  constructor(
    private projectService: ProjectService,
    private toastService: ToastService,
    public authService: AuthService
  ) {
    this.getAllProjects();
    this.getImages()
  }

  selectImageOption(option: string) {
    this.imageOption = option;
    this.isDropdownOpen = false;
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
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

  openModal(index: number) {
    this.selectedProject =
      this.projects.find((project) => project.project_id === index) || null;
    this.isModalOpen[index] = true;
  }

  closeModal(index: number) {
    this.isModalOpen[index] = false;
    this.isDropdownOpen = false;
  }

  openDeleteModal(index: number) {
    this.isDeleteModalOpen[index] = true;
  }

  closeDeleteModal(index: number) {
    this.isDeleteModalOpen[index] = false;
  }

  openImageModal(index: number) {
    this.isImageModalOpen[index] = true;
    this.imageOption = '';
    this.isDropdownOpen = false;
  }

  closeImageModal(index: number) {
    this.isImageModalOpen[index] = false;
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    console.log(file)
    if (file && this.selectedProject != null) {
      this.selectedProject.path = file;
    }
  }

  getImages() {
    this.projectService.getImages().subscribe({
      next: (response:any) => {
        this.images= response.data.images
        console.log(this.images[0])
      }
    })
  }

  selectImage(image: any) {
    console.log('Imagen seleccionada:', image);
  
    if (this.selectedProject) {
      // Actualiza la propiedad 'path' del proyecto con la URL de la imagen seleccionada
      this.selectedProject.path = image.url;
  
      // Puedes también manejar la vista previa de la imagen si se necesita
      // Si la imagen es un archivo (y no una URL), usa URL.createObjectURL
      if (image.file) {
        this.selectedProject.path = URL.createObjectURL(image.file);
      }
    }
  }



  getAllProjects() {
    this.projectService.getAllProjects().subscribe({
      next: (response: ProjectGetResponse) => {
        if (response.success) {
          this.projects = response.data.projects;
        }
      },
    });
  }

  updateProjectHomeImage(projectId:number){

    if (this.selectedProject) {
      console.log("Proj",this.selectedProject)
      const formData = new FormData();
      formData.append('name', this.selectedProject.name);
      formData.append('description', this.selectedProject.description);
      formData.append('path', this.selectedProject.path);
      this.projectService.updateProjectHomeImage(projectId, formData).subscribe({
        next: (response: ProjectPutResponse) => {
          console.log(response)
        }
      })
    }
    
  
  }

  updateProject(projectId: number) {
    if (this.selectedProject) {
      console.log("Proj",this.selectedProject)
      const formData = new FormData();
      formData.append('name', this.selectedProject.name);
      formData.append('description', this.selectedProject.description);
      formData.append('path', this.selectedProject.path);

      this.projectService.updateProject(projectId, formData).subscribe({
        next: (response: ProjectPutResponse) => {
          if (response.success) {
            this.showSuccessToast('Proyecto actualizado exitosamente');
            this.closeModal(projectId);
          }
        },
        error: (error: any) => {
          this.showErrorToast('Error al actualizar el proyecto');
        },
      });
    }
  }

  deleteProject(projectId: number) {
    this.projectService.deleteProject(projectId).subscribe({
      next: (response: any) => {
        this.showInfoToast('Eliminación del proyecto en progreso...');
        setTimeout(() => {
          this.showSuccessToast('Proyecto eliminado exitosamente');
          this.getAllProjects(); // Refrescar la lista de proyectos después de la eliminación
        }, 2000);
      },
      error: (error: any) => {
        this.showErrorToast(
          `Error al eliminar el proyecto: ${error.message || error}`
        );
      },
    });
  }
}
