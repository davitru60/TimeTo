export interface Project{
    project_id:number;
    name:string;
    description:string
    path:string
}

export interface ProjectResponse{
    success:boolean;
    data:{
        projects: Project []
    }
}

export interface ProjectImagesResponse{
    success:boolean;
    data:{
        images:string []
    }
}

export interface ImageOrderPut{
    previousIndex:number
    newIndex:number
}