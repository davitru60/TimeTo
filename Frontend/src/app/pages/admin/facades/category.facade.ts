import { Injectable } from '@angular/core';
import { CategoryService } from '../services/category.service';
import { Observable } from 'rxjs';
import { CategoryGetResponse, CategoryPostData, CategoryPostResponse } from '../../../core/interfaces/category.interface';

@Injectable({
  providedIn: 'root',
})
export class CategoryFacade {
  constructor(private categoryService: CategoryService) {

  }
  getCategories(): Observable<CategoryGetResponse> {
    return this.categoryService.getCategories();
  }

  createCategory(category: CategoryPostData): Observable<CategoryPostResponse> {
    return this.categoryService.createCategory(category);
  }

  updateCategory(categoryId: number, category: CategoryPostData): Observable<CategoryPostResponse> {
    return this.categoryService.updateCategory(categoryId, category);
  }

  deleteCategory(categoryId: number): Observable<any> {
    return this.categoryService.deleteCategory(categoryId);
  }
  
}
