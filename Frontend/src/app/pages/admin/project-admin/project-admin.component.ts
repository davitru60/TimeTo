import { Component } from '@angular/core';
import {
  Project,
  ProjectGetResponse,
  ProjectHomeImagePutData,
  ProjectPutData
} from '../../../core/interfaces/project.interface';
import { ProjectService } from '../../projects/services/project.service';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import {
  Category,
  CategoryGetResponse,
} from '../../../core/interfaces/category.interface';
import {
  ProjectCategory,
  ProjectCategoryDeleteResponse,
  ProjectCategoryGetResponse,
  ProjectCategoryPostData,
  ProjectCategoryPostResponse,
} from '../../../core/interfaces/project-category.interface';
import { ImageSelectorComponent } from '../../../shared/components/ui/image-selector/image-selector.component';
import { ModalComponent } from '../../../shared/components/ui/modal/modal.component';
import { PaginationComponent } from '../../../shared/components/ui/pagination/pagination.component';
import { ToastComponent } from '../../../shared/components/ui/toast/toast.component';
import { ToastFacade } from '../../../shared/components/ui/toast/toast.facade';
import {
  SuccessProjectCategoryToastMessages
} from '../../../shared/components/ui/toast/toastMessages';
import { ProjectUIFacade } from '../../../shared/shared-ui-facades/project-ui.facade';
import { CategoryFacade } from '../facades/category.facade';
import { ProjectCategoryFacade } from '../facades/project-category.facade';
import { ProjectImagesFacade } from '../facades/project-images.facade';
import { AddProjectComponent } from './add-project/add-project.component';

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
    ImageSelectorComponent,
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
    path: '',
  };

  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 0;

  searchTerm: string = '';
  imageOption: string = '';

  deleteModalStyle = 'lg:w-1/3';
  imageModalStyle = 'lg:w-1/2';

  selectedImage: string = '';
  originalImage: string | null = null;

  constructor(
    private categoryFacade: CategoryFacade,
    private projectService: ProjectService,
    private projectCategoryFacade: ProjectCategoryFacade,
    private projectImagesFacade: ProjectImagesFacade,
    private toastFacade: ToastFacade,
    private projectUIFacade: ProjectUIFacade,
  ) {
    this.getAllProjects();
    this.getCategories();
    this.getImages();
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
    this.totalPages = Math.ceil(
      this.filteredProjects.length / this.itemsPerPage
    );
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

  openDeleteProjectModal(index: number) {
    this.isDeleteProjectModalOpen[index] = true;
  }

  closeDeleteProjectModal(index: number) {
    this.isDeleteProjectModalOpen[index] = false;
  }

  openCategoryModal(index: number, project: Project) {
    this.projectCategoryFacade
      .getProjectCategories(project.project_id)
      .subscribe({
        next: (response: ProjectCategoryGetResponse) => {
          if (response.success) {
            this.projectCategories = response.data.projectCategories;
            this.isCategoryModalOpen[index] = true;
          }
        },
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

  getImages() {
    this.projectImagesFacade.getImages().subscribe({
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
        this.toastFacade.showSuccessToast(`Imagen seleccionada: ${eventOrImage.name}`)

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

  hasCategory(
    category: Category,
    projectCategories: ProjectCategory[]
  ): boolean {
    for (let i = 0; i < projectCategories.length; i++) {
      if (projectCategories[i].category_id === category.category_id) {
        return true;
      }
    }
    return false;
  }

  toggleCategory(category: Category, project: Project): void {
    const index = this.projectCategories.findIndex(
      (projectCategory) => projectCategory.category_id === category.category_id
    );
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

      this.projectCategoryFacade
        .addProjectCategory(newProjectCategory)
        .subscribe((response: ProjectCategoryPostResponse) => {
          if (response.success) {
            console.log(response);
            this.toastFacade.showSuccessToast(
              SuccessProjectCategoryToastMessages.PROJECT_CATEGORY_CREATE_MESSAGE
            );
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

      this.projectCategoryFacade
        .deleteProjectCategory(projectCategory.proj_cat_id)
        .subscribe((response: ProjectCategoryDeleteResponse) => {
          if (response.success) {
            this.toastFacade.showSuccessToast(
              SuccessProjectCategoryToastMessages.PROJECT_CATEGORY_DELETE_MESSAGE
            );
          }
        });

      console.log(`Categoría "${category.name}" eliminada del proyecto.`);
    } else {
      console.log(
        `La categoría "${category.name}" no está presente en el proyecto.`
      );
    }
  }

  getAllProjects() {
    this.projectService
      .getAllProjects()
      .subscribe((response: ProjectGetResponse) => {
        this.projects = response.data.projects;
        this.filteredProjects = [...this.projects]; // Initialize filteredProjects with all projects
        this.totalPages = Math.ceil(
          this.filteredProjects.length / this.itemsPerPage
        );

        // Inicializamos isModalOpen con valores false para cada proyecto
        this.isEditProjectModalOpen = new Array(
          this.filteredProjects.length
        ).fill(false);
      });
  }

  updateProject(projectId:number): void {
    this.projectUIFacade.updateProject(
      projectId, 
      this.selectedProject, 
      this.selectedImage, 
      this.closeEditProjectModal.bind(this), 
      this.getAllProjects.bind(this)         
    );
  }

  deleteProject(projectId: number) {
    this.projectUIFacade.deleteProject(
      projectId,
      this.getAllProjects.bind(this)
    );
  }


  getCategories() {
    this.categoryFacade
      .getCategories()
      .subscribe((response: CategoryGetResponse) => {
        this.categories = response.data.categories;
        this.totalPages = Math.ceil(this.categories.length / this.itemsPerPage);
      });
  }

  onSearchChange(event: any) {
    const searchTerm = event.target.value.toLowerCase().trim();

    if (!searchTerm) {
      this.filteredProjects = [...this.projects]; // Restore original projects when search term is empty
    } else {
      this.filteredProjects = this.projects.filter(
        (project) =>
          project.name.toLowerCase().includes(searchTerm) ||
          project.description.toLowerCase().includes(searchTerm)
      );
    }

    // Update pagination after filtering
    this.currentPage = 1;
    this.updatePaginatedProjects();
  }
}
