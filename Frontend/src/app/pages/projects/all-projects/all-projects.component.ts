import { Component } from '@angular/core';
import { NavbarComponent } from '../../../shared/components/layout/navbar/navbar.component';
import { ProjectService } from '../services/project.service';
import {
  Project,
  ProjectDeleteResponse,
  ProjectGetResponse,
  ProjectHomeImagePutData,
  ProjectPutData,
  ProjectPutResponse,
} from '../../../core/interfaces/project.interface';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { PaginationComponent } from '../../../shared/components/ui/pagination/pagination.component';
import { ModalComponent } from './../../../shared/components/ui/modal/modal.component';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../../shared/components/ui/toast/toast.service';
import { ToastComponent } from '../../../shared/components/ui/toast/toast.component';
import { AuthService } from '../../auth/services/auth.service';
import { ImageSelectorComponent } from '../../../shared/components/ui/image-selector/image-selector.component';
import { ProjectUIFacade } from '../../../shared/shared-ui-facades/project-ui.facade';

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
    ImageSelectorComponent,
  ],
})
export class AllProjectsComponent {
  projects: Project[] = [];
  images: any[] = [];
  selectedProject: Project | null = null;
  currentImage: string | null = null;
  selectedImage: string = '';

  currentPage = 1;
  itemsPerPage = 4;
  isModalOpen: boolean[] = [];
  isDeleteModalOpen: boolean[] = [];
  isImageModalOpen: boolean[] = [];
  isLoading = false;
  isDropdownOpen = false;
  originalImage: string | null = null;

  project: ProjectPutData = {
    name: '',
    description: '',
    path: '',
  };

  projectHomeImage: ProjectHomeImagePutData = {
    project_id: 0,
    path: '',
  };

  deleteModalStyle = 'lg:w-1/3';
  imageModalStyle = 'lg:w-1/2';

  imageOption: string = '';

  constructor(
    private projectService: ProjectService,
    private toastService: ToastService,
    private projectUIFacade: ProjectUIFacade,
    public authService: AuthService
  ) {
    this.getAllProjects();
    this.getImages();
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
    this.selectedImage = '';
  }

  openDeleteModal(index: number) {
    this.isDeleteModalOpen[index] = true;
  }

  closeDeleteModal(index: number) {
    this.isDeleteModalOpen[index] = false;
    this.isDropdownOpen = false;
  }

  openImageModal(index: number) {
    this.isImageModalOpen[index] = true;
    this.imageOption = '';
    this.originalImage = this.selectedProject?.path || null;
  }

  closeImageModal(index: number) {
    this.isImageModalOpen[index] = false;
  }

  getImages() {
    this.projectService.getImages().subscribe({
      next: (response: any) => {
        this.images = response.data.images;
      },
    });
  }

  handleImageSelection(eventOrImage: any, isFile: boolean) {
    if (isFile) {
      const file = eventOrImage.target.files[0];
      if (file && this.selectedProject != null) {
        this.selectedImage = file;
      }
    } else {
      if (this.selectedProject) {
        this.selectedImage = eventOrImage.name;
        this.projectHomeImage.path = eventOrImage.name;

        this.showSuccessToast(`Imagen seleccionada: ${eventOrImage.name}`);
      }
    }
  }

  cancelImageUpload(index: number) {
    if (this.originalImage !== null && this.selectedProject) {
      this.selectedProject.path = this.originalImage; // Restaura la imagen original
      this.originalImage = null;
    }
    this.closeImageModal(index);
  }

  imageSelected(index: number) {
    if (this.selectedProject) {
      this.closeImageModal(index);
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

  updateProject(projectId: number): void {
    this.projectUIFacade.updateProject(
      projectId,
      this.selectedProject,
      this.selectedImage,
      this.closeModal.bind(this),
      this.getAllProjects.bind(this)
    );
  }

  deleteProject(projectId: number) {
    this.projectUIFacade.deleteProject(
      projectId,
      this.getAllProjects.bind(this)
    );
  }
}
