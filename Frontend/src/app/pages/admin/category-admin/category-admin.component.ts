import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProjectService } from '../../projects/services/project.service';
import {
  Category,
  CategoryGetResponse,
  CategoryPutResponse,
  CategoryPutData,
} from '../../../core/interfaces/category.interface';
import { PaginationComponent } from '../../../shared/components/ui/pagination/pagination.component';
import { AddCategoryComponent } from './add-category/add-category.component';
import { ModalComponent } from '../../../shared/components/ui/modal/modal.component';
import { ToastService } from '../../../shared/components/ui/toast/toast.service';

@Component({
  selector: 'app-category-admin',
  standalone: true,
  templateUrl: './category-admin.component.html',
  styleUrl: './category-admin.component.scss',
  imports: [
    CommonModule,
    FormsModule,
    PaginationComponent,
    AddCategoryComponent,
    ModalComponent,
  ],
})
export class CategoryAdminComponent {
  categories: Category[] = [];

  isAddCategoryModalOpen = false;
  isEditCategoryModalOpen: boolean[] = [];
  isDeleteCategoryModalOpen: boolean[] = [];

  selectedCategory: Category | null = null;
  deleteModalStyle = 'lg:w-1/3';

  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 0;

  constructor(
    private projectService: ProjectService,
    private toastService: ToastService
  ) {
    this.getCategories();
  }

  get paginatedCategories() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.categories.slice(startIndex, endIndex);
  }

  onPageChange(newPage: number) {
    this.currentPage = newPage;
    this.updatePaginatedCategories();
  }

  onItemsPerPageChange(newItemsPerPage: number) {
    this.itemsPerPage = newItemsPerPage;
    this.currentPage = 1;
    this.updatePaginatedCategories();
  }

  updatePaginatedCategories() {
    this.totalPages = Math.ceil(this.categories.length / this.itemsPerPage);
  }

  openAddCategoryModal() {
    this.isAddCategoryModalOpen = true;
  }

  closeAddCategoryModal() {
    this.isAddCategoryModalOpen = false;
  }

  openEditCategoryModal(index: number) {
    this.isEditCategoryModalOpen[index] = true;
    this.selectedCategory = this.categories[index];
  }

  closeEditCategoryModal(index: number) {
    this.isEditCategoryModalOpen[index] = false;
    this.selectedCategory = null;
  }

  openDeleteCategoryModal(index: number) {
    this.isDeleteCategoryModalOpen[index] = true;
  }

  closeDeleteCategoryModal(index: number) {
    this.isDeleteCategoryModalOpen[index] = false;
  }

  showSuccessToast(message: string) {
    this.toastService.showToast({ text: message, type: 'success' });
  }

  getCategories() {
    this.projectService.getCategories().subscribe({
      next: (response: CategoryGetResponse) => {
        this.categories = response.data.categories;
        this.totalPages = Math.ceil(this.categories.length / this.itemsPerPage);
        this.isEditCategoryModalOpen = new Array(this.categories.length).fill(
          false
        );
      },
    });
  }

  updateCategory(categoryId: number) {
    if (this.selectedCategory) {
      const categoryData: CategoryPutData = {
        name: this.selectedCategory.name,
      };

      this.projectService.updateCategory(categoryId, categoryData).subscribe({
        next: (response: CategoryPutResponse) => {
          if (response.success) {
            this.showSuccessToast('Categoría actualizada exitosamente');
            this.closeEditCategoryModal(
              this.categories.findIndex(
                (category) => category.category_id === categoryId
              )
            );
            this.closeEditCategoryModal(categoryId);
          }
        },
      });
    }
  }

  deleteCategory(categoryId: number) {
    this.projectService.deleteCategory(categoryId).subscribe({
      next: (response) => {
        if (response.success) {
          this.showSuccessToast('Categoría eliminada correctamente');
          this.closeDeleteCategoryModal(categoryId);
          this.getCategories();
        }
      },
    });

  }
}
