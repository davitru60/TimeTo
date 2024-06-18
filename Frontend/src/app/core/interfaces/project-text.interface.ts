export interface ProjectTexts{
    proj_text_id:number;
    project_id: number;
    f_type_id: number;
    title:string;
    text:string;
    index:number;
}

export interface TextPostData{
    project_id:number,
    f_type_id:number;
    title:string;
    text:string;
    index:number;
  }

  export interface TextPutData{
    title:string;
    text:string;
    proj_text_id:string,
    previousIndex: number;
  }
  
export interface ProjectTextsGetResponse{
    success: boolean;
    data:{
        texts: ProjectTexts []
    };
}