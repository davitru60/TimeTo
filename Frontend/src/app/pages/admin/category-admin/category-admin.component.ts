import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  Category,
  CategoryGetResponse,
  CategoryPutData,
  CategoryPutResponse,
} from '../../../core/interfaces/category.interface';
import { ModalComponent } from '../../../shared/components/ui/modal/modal.component';
import { PaginationComponent } from '../../../shared/components/ui/pagination/pagination.component';
import { ToastFacade } from '../../../shared/components/ui/toast/toast.facade';
import { ErrorCategoryToastMessages, SuccessCategoryToastMessages } from '../../../shared/components/ui/toast/toastMessages';
import { CategoryFacade } from '../facades/category.facade';
import { AddCategoryComponent } from './add-category/add-category.component';

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
    private categoryFacade: CategoryFacade,
    private toastFacade: ToastFacade
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

  
  getCategories() {
    this.categoryFacade.getCategories().subscribe({
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

      this.categoryFacade.updateCategory(categoryId, categoryData).subscribe({
        next: (response: CategoryPutResponse) => {
          if (response.success) {
            this.toastFacade.showSuccessToast(SuccessCategoryToastMessages.CATEGORY_UPDATE_MESSAGE);
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
    this.categoryFacade.deleteCategory(categoryId).subscribe({
      next: (response) => {
        if (response.success) {
          this.toastFacade.showSuccessToast(SuccessCategoryToastMessages.CATEGORY_DELETE_MESSAGE);
          this.closeDeleteCategoryModal(categoryId);
          this.getCategories();
        }
      },
      error: (err:any)=>{
        this.toastFacade.showErrorToast(ErrorCategoryToastMessages.CATEGORY_DELETE_MESSAGE);
      }
    });

  }
}
