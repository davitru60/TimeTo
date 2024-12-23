import { ApiResponse } from "./api-response.interface";

export interface Project {
  previewUrl: string;
  project_id: number;
  name: string;
  description: string;
  path: string;
}


export interface ProjectPostData{
  name: string;
  description: string;
  path: string;
}

export interface ProjectPutData{
  name: string;
  description: string;
  path: string;
}


export interface ProjectGetResponse {
  success: boolean;
  data: {
    projects: Project[];
  };
}

export interface ProjectHomeImagePutData{
  project_id:number,
  path:string
}

export interface ProjectPutResponse extends ApiResponse{
  data: Project;
}

export interface ProjectDeleteResponse extends ApiResponse{}

export interface ProjectImagesResponse {
  success: boolean;
  data: {
    images: string[];
  };
}



export interface ImageOrderPut {
  proj_img_id: number;
  previousIndex: number;
  newIndex: number;
}

export interface EditorOrderPut {
  proj_text_id: number;
  previousIndex: number;
  newIndex: number;
}

export interface FormFields {
  f_type_id: number;
  proj_img_id?: string;
  proj_text_id?: string;
  path?: string;
  text?: string;
  title?: string;
  image?: any;
  index?: number;
}



