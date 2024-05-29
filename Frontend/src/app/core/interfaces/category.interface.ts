import { ApiResponse } from "./api-response.interface";

export interface Category {
  category_id: number;
  name: string;
}

export interface CategoryPostData {
  name: string;
}

export interface CategoryPutData {
  name: string;
}

export interface CategoryGetResponse {
  success: boolean;
  data: {
    categories: Category[];
  };
}

export interface CategoryPostResponse extends ApiResponse {
  data: Category
}

export interface CategoryPutResponse extends ApiResponse {
  data: Category
}

