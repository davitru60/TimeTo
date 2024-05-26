import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProjectService } from '../../projects/services/project.service';
import { Category, CategoryGet } from '../../projects/interfaces/project.interface';
import { PaginationComponent } from "../../../shared/components/ui/pagination/pagination.component";

@Component({
    selector: 'app-category-admin',
    standalone: true,
    templateUrl: './category-admin.component.html',
    styleUrl: './category-admin.component.scss',
    imports: [CommonModule, FormsModule, PaginationComponent]
})
export class CategoryAdminComponent {
  categories: Category[] = []
  isModalOpen: boolean[] = [];
  selectedCategory: Category | null = null;

  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 0;
  
  constructor (private projectService:ProjectService){
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

  openModal(index: number) {
    this.selectedCategory =
      this.categories.find((category) => category.category_id === index) || null;
    this.isModalOpen[index] = true;
  }

  closeModal(index:number){
    this.isModalOpen[index] = false
  }

  getProjectCategories(){
    this.projectService.getProjectCategories().subscribe(
      (response:CategoryGet)=>{
        this.categories = response.data.categories
        this.totalPages = Math.ceil(this.categories.length / this.itemsPerPage);
      }
    )
  }
}
