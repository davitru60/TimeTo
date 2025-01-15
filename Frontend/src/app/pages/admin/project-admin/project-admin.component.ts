import { Component} from '@angular/core';
import { NavbarComponent } from '../../../shared/components/layout/navbar/navbar.component';
import { ProjectService } from '../../projects/services/project.service';
import {
  Project,
  ProjectDeleteResponse,
  ProjectGetResponse,
  ProjectHomeImagePutData,
  ProjectPutData,
  ProjectPutResponse,
} from '../../../core/interfaces/project.interface';

import { ProjectCategory,ProjectCategoryDeleteResponse,ProjectCategoryPostData, ProjectCategoryPostResponse } from '../../../core/interfaces/project-category.interface';
import { Category,CategoryGetResponse } from '../../../core/interfaces/category.interface';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../shared/components/ui/toast/toast.service';
import { FormsModule} from '@angular/forms';
import { ModalComponent } from '../../../shared/components/ui/modal/modal.component';
import { ToastComponent } from '../../../shared/components/ui/toast/toast.component';
import { PaginationComponent } from '../../../shared/components/ui/pagination/pagination.component';
import { AddProjectComponent } from './add-project/add-project.component';
import { TableModule } from 'primeng/table';
import { ProjectCategoryGetResponse } from '../../../core/interfaces/project-category.interface';
import { ImageSelectorComponent } from "../../../shared/components/ui/image-selector/image-selector.component";

@Component({
  selector: 'app-project-admin',
  standalone: true,
  templateUrl: './project-admin.component.html',
  styleUrls: ['./project-admin.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    ModalComponent,
    ToastComponent,
    PaginationComponent,
    AddProjectComponent,
    TableModule,
    ImageSelectorComponent
],
})
export class ProjectAdminComponent {
  projects: Project[] = [];
  filteredProjects: Project[] = [];
  categories: Category[] = [];
  projectCategories: ProjectCategory[] = [];

  isEditProjectModalOpen: boolean[] = [];
  isCategoryModalOpen: boolean[] = [];
  isDeleteProjectModalOpen: boolean[] = [];
  isImageModalOpen: boolean[] = [];
  images: any[] = [];

  isAddProjectModalOpen = false;
  isAddCategoryModalOpen = false;
  isDeleteCategoryModalOpen = false;
  isDropdownOpen = false;

  selectedProject: Project | null = null;

  project: ProjectPutData = {
    name: '',
    description: '',
    path: '',
  };

  projectCategory: ProjectCategoryPostData = {
    project_id: 0,
    category_id: 0,
  };

  projectHomeImage: ProjectHomeImagePutData = {
    project_id: 0,
    path: ''
  }

  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 0;

  searchTerm: string = '';
  imageOption: string = '';

  deleteModalStyle = 'lg:w-1/3'
  imageModalStyle = 'lg:w-1/2';
  

  constructor(
    private projectService: ProjectService,
    private toastService: ToastService
  ) {
    this.getAllProjects();
    this.getCategories();
    this.getImages()
  }


  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  get paginatedProjects() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredProjects.slice(startIndex, endIndex);
  }

  onPageChange(newPage: number) {
    this.currentPage = newPage;
    this.updatePaginatedProjects();
  }

  onItemsPerPageChange(newItemsPerPage: number) {
    this.itemsPerPage = newItemsPerPage;
    this.currentPage = 1;
    this.updatePaginatedProjects();
  }

  updatePaginatedProjects() {
    this.totalPages = Math.ceil(this.filteredProjects.length / this.itemsPerPage);
  }

  openAddProjectModal() {
    this.isAddProjectModalOpen = true;
  }

  closeAddProjectModal() {
    this.isAddProjectModalOpen = false;
  }

  openEditProjectModal(index: number) {
    this.isEditProjectModalOpen[index] = true;
    this.selectedProject = this.filteredProjects[index];
  }

  closeEditProjectModal(index: number) {
    this.isEditProjectModalOpen[index] = false;
    this.selectedProject = null;
  }

  openDeleteProjectModal(index:number){
    this.isDeleteProjectModalOpen[index] = true;
  }

  closeDeleteProjectModal(index:number){
    this.isDeleteProjectModalOpen[index] = false;
  }

  selectImage(image: any) {
    console.log('Imagen seleccionada:', image);

    if (this.selectedProject) {
      this.selectedProject.path = image.url;
      this.projectHomeImage.path = image.name
      this.showSuccessToast(`Imagen seleccionada: ${image.name}`)

  
      if (image.file) {
        this.selectedProject.path = URL.createObjectURL(image.file);
      }
    }
  }

  getImages() {
    this.projectService.getImages().subscribe({
      next: (response: any) => {
        console.log(this.images)
        this.images = response.data.images;
      },
    });
  }


  openCategoryModal(index: number, project: Project) {
    this.projectService.getProjectCategories(project.project_id).subscribe({
      next: (response: ProjectCategoryGetResponse) => {
        if(response.success){
          this.projectCategories = response.data.projectCategories;
          this.isCategoryModalOpen[index] = true;
        }
      }
       
      });
      
  }

  closeCategoryModal(index: number) {
    this.isCategoryModalOpen[index] = false;
  }

  openImageModal(index: number) {
    this.isImageModalOpen[index] = true;
    this.imageOption = '';
    this.isDropdownOpen = false;
  }

  closeImageModal(index: number) {
    this.isImageModalOpen[index] = false;
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

  hasCategory(category: Category, projectCategories: ProjectCategory[]): boolean {
    for (let i = 0; i < projectCategories.length; i++) {
      if (projectCategories[i].category_id === category.category_id) {
        return true;
      }
    }
    return false;
  }

  toggleCategory(category: Category, project: Project): void {
    const index = this.projectCategories.findIndex(
      (projectCategory) => projectCategory.category_id === category.category_id);
    if (index !== -1) {
      this.deleteProjectCategory(category);
    } else {
      this.addProjectCategory(category, project);
    }
  }

  addProjectCategory(category: Category, project: Project): void {
    const index = this.projectCategories.findIndex(
      (projectCategory) => projectCategory.category_id === category.category_id
    );
    if (index === -1) {
      const newProjectCategory: ProjectCategory = {
        proj_cat_id: 0,
        project_id: project.project_id,
        category_id: category.category_id,
      };
      this.projectCategories.push(newProjectCategory);

      this.projectService.addProjectCategory(newProjectCategory).subscribe((response: ProjectCategoryPostResponse) => {
          if(response.success){
            console.log(response)
            this.showSuccessToast('Categoría añadida correctamente');
          }
        });

      console.log(`Categoría "${category.name}" añadida al proyecto.`);
    } else {
      console.log(`La categoría "${category.name}" ya existe en el proyecto.`);
    }
  }

  deleteProjectCategory(category: Category): void {
    const index = this.projectCategories.findIndex(
      (projectCategory) => projectCategory.category_id === category.category_id
    );
    if (index !== -1) {
      const projectCategory = this.projectCategories[index];
      this.projectCategories.splice(index, 1);

      this.projectService
        .deleteProjectCategory(projectCategory.proj_cat_id)
        .subscribe((response: ProjectCategoryDeleteResponse) => {
          if(response.success){
            this.showSuccessToast('Categoría eliminada correctamente');
          }
        });

      console.log(`Categoría "${category.name}" eliminada del proyecto.`);
    } else {
      console.log(
        `La categoría "${category.name}" no está presente en el proyecto.`
      );
    }
  }

  updateProjectHomeImage(projectId: number,index:number) {
    if (this.selectedProject) {
      this.projectHomeImage.project_id=projectId
      this.projectService.updateProjectHomeImage(projectId, this.projectHomeImage).subscribe({
          next: (response: any) => {
            if (response.success) {
              this.showSuccessToast('Imagen actualizada con éxito');
              this.closeImageModal(index)
            }

          },
        });
    }
  }

  getAllProjects() {
    this.projectService.getAllProjects().subscribe((response: ProjectGetResponse) => {
      this.projects = response.data.projects;
      this.filteredProjects = [...this.projects]; // Initialize filteredProjects with all projects
      this.totalPages = Math.ceil(this.filteredProjects.length / this.itemsPerPage);

      // Inicializamos isModalOpen con valores false para cada proyecto
      this.isEditProjectModalOpen = new Array(this.filteredProjects.length).fill(false);
    });
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file && this.selectedProject != null) {
      this.selectedProject.path = file;
    }
  }

  updateProject(projectId: number) {
    if (this.selectedProject) {
      const formData = new FormData();
      formData.append('name', this.selectedProject.name);
      formData.append('description', this.selectedProject.description);
      formData.append('path', this.selectedProject.path);
     

      this.projectService.updateProject(projectId, formData).subscribe(
        (response: ProjectPutResponse) => {
          if(response.success){
            this.showSuccessToast('Proyecto actualizado exitosamente');
            this.closeEditProjectModal(projectId);
            this.getAllProjects();
          }
         
        },
        (error: any) => {
          this.showErrorToast('Error al actualizar el proyecto');
        }
      );
    } 
  }

  deleteProject(projectId: number) {
    this.projectService.deleteProject(projectId).subscribe(
      (response: ProjectDeleteResponse) => {

        if(response.success){
          this.showInfoToast('Eliminación del proyecto en progreso...');
          setTimeout(() => {
            this.showSuccessToast('Proyecto eliminado exitosamente');
            this.getAllProjects();
          }, 2000);
        }
      },
      (error: ProjectDeleteResponse) => {
        this.showErrorToast(
          `Error al eliminar el proyecto: ${error.msg || error}`
        );
      }
    );
  }

  getCategories() {
    this.projectService.getCategories().subscribe((response: CategoryGetResponse) => {
      this.categories = response.data.categories;
      this.totalPages = Math.ceil(this.categories.length / this.itemsPerPage);
    });
  }

  onSearchChange(event: any) {
    const searchTerm = event.target.value.toLowerCase().trim();

    if (!searchTerm) {
      this.filteredProjects = [...this.projects]; // Restore original projects when search term is empty
    } else {
      this.filteredProjects = this.projects.filter(project =>
        project.name.toLowerCase().includes(searchTerm) ||
        project.description.toLowerCase().includes(searchTerm)
      );
    }

    // Update pagination after filtering
    this.currentPage = 1;
    this.updatePaginatedProjects();
  }
}
