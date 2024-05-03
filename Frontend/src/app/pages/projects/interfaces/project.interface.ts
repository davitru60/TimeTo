export interface Project {
    project_id: number;
    name: string;
    description: string;
    path: string;
  }
  
  export interface ProjectResponse {
    success: boolean;
    data: {
      projects: Project[];
    };
  }
  
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
    index?:number;
  }
  