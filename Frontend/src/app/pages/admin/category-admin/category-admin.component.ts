import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProjectService } from '../../projects/services/project.service';
import { Category, CategoryGet, CategoryPut } from '../../projects/interfaces/project.interface';
import { PaginationComponent } from "../../../shared/components/ui/pagination/pagination.component";
import { AddCategoryComponent } from "./add-category/add-category.component";
import { ModalComponent } from "../../../shared/components/ui/modal/modal.component";
import { ToastService } from '../../../shared/components/ui/toast/toast.service';

@Component({
    selector: 'app-category-admin',
    standalone: true,
    templateUrl: './category-admin.component.html',
    styleUrl: './category-admin.component.scss',
    imports: [CommonModule, FormsModule, PaginationComponent, AddCategoryComponent, ModalComponent]
})
export class CategoryAdminComponent {
  categories: Category[] = []

  isAddCategoryModalOpen=false
  isEditCategoryModalOpen: boolean[] = [];


  selectedCategory: Category | null = null;

  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 0;
  
  constructor (private projectService:ProjectService,   
    private toastService: ToastService){
    this.getProjectCategories()
  }

  get paginatedCategories() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.categories.slice(startIndex, endIndex);
  }

  onPageChange(newPage: number) {
    this.currentPage = newPage;
  }

  onItemsPerPageChange(newItemsPerPage: number) {
    this.itemsPerPage = newItemsPerPage;
    this.currentPage = 1;
  }

  openAddCategoryModal(){
    this.isAddCategoryModalOpen=true
  }

  closeAddCategoryModal(){
    this.isAddCategoryModalOpen=false
  }

  openEditCategoryModal(index: number) {
    this.isEditCategoryModalOpen[index] = true;
    this.selectedCategory = this.categories[index];
  }

  closeEditCategoryModal(index:number){


    this.isEditCategoryModalOpen[index] = false;
    this.selectedCategory = null;
  }

  showSuccessToast(message: string) {
    this.toastService.showToast({ text: message, type: 'success' });
  }

  getProjectCategories(){
    this.projectService.getProjectCategories().subscribe(
      (response:CategoryGet)=>{
        this.categories = response.data.categories
        this.totalPages = Math.ceil(this.categories.length / this.itemsPerPage);

        this.isEditCategoryModalOpen = new Array(this.categories.length).fill(false);
      }
    )
  }

  updateProjectCategory(categoryId:number){
    if(this.selectedCategory){
      const categoryData:CategoryPut = {
        name: this.selectedCategory.name
      }
      this.projectService.updateProjectCategory(categoryId,categoryData).subscribe(
        (response:any)=>{
          this.showSuccessToast('Proyecto actualizado exitosamente');
          this.closeEditCategoryModal(this.categories.findIndex(category => category.category_id === categoryId));
          this.closeEditCategoryModal(categoryId);
      })
    }

    

  }
}
