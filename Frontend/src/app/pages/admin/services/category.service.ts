import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { projectRoutes } from '../../../../environments/environment.development';
import { CategoryGetResponse, CategoryPostData, CategoryPostResponse, CategoryPutData, CategoryPutResponse } from '../../../core/interfaces/category.interface';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http: HttpClient) { }

    getCategories():Observable<CategoryGetResponse>{
      return this.http.get<CategoryGetResponse>(projectRoutes.getCategories,{params:{auth:'true'}})
    }
  
    createCategory(category:CategoryPostData): Observable<CategoryPostResponse>{
      return this.http.post<CategoryPostResponse>(projectRoutes.createCategory, category)
    }
  
    updateCategory(categoryId:number,category:CategoryPutData): Observable<CategoryPutResponse>{
      return this.http.put<CategoryPutResponse>(projectRoutes.updateCategory(categoryId),category)
    }
  
    deleteCategory(categoryId:number):Observable<any>{
      return this.http.delete<any>(projectRoutes.deleteCategory(categoryId))
    }
}
