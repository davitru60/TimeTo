import { ApiResponse } from "./api-response.interface";

export interface ProjectCategory{
    proj_cat_id:number;
    project_id:number;
    category_id:number;
}

export interface ProjectCategoryPostData{
    project_id:number;
    category_id:number;  
}


export interface ProjectCategoryGetResponse{
    success: boolean;
    data: {
      projectCategories: ProjectCategory [];
    };
}

export interface ProjectCategoryPostResponse extends ApiResponse{
    data: ProjectCategory;
}

export interface ProjectCategoryDeleteResponse extends ApiResponse {}
