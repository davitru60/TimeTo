export const environment = {
    baseUrl: 'http://localhost:9090/api',
    googleClientId: '659893836575-kkd9rsiavi6od7j6pv5ko84usog4gaas.apps.googleusercontent.com'
  };
  
  export const endpoints = {
    authEndpoint: '/auth',
    projectEndpoint: '/projects',
  };
  
  export const authRoutes = {
    login: environment.baseUrl + endpoints.authEndpoint + '/login',
    register: environment.baseUrl + endpoints.authEndpoint + '/register',
    googleSignIn: environment.baseUrl + endpoints.authEndpoint + '/google-sign-in'
  };
  
  export const projectRoutes = {
    getAllProjects: environment.baseUrl + endpoints.projectEndpoint + '/projects',
    getRecommendedProjects: environment.baseUrl + endpoints.projectEndpoint + '/recommended-projects',
    createProject: environment.baseUrl + endpoints.projectEndpoint + '/projects',
    updateProject:(projectId:number) => environment.baseUrl + endpoints.projectEndpoint + '/projects/' + projectId,
    deleteProject: (projectId:number) => environment.baseUrl + endpoints.projectEndpoint + '/projects/' + projectId,

    //Categories
    getCategories: environment.baseUrl + endpoints.projectEndpoint + '/category',
    createCategory: environment.baseUrl + endpoints.projectEndpoint + '/category',
    updateCategory: (categoryId:number) => environment.baseUrl + endpoints.projectEndpoint + '/category/' + categoryId ,

    //Project categories
    getProjectCategories: (projectId:number) => environment.baseUrl + endpoints.projectEndpoint + '/project-category/'+ projectId,
    addProjectCategory: environment.baseUrl + endpoints.projectEndpoint + '/project-category/',
    deleteProjectCategory: (projCatId:number) => environment.baseUrl + endpoints.projectEndpoint + '/project-category/' + projCatId,

    //Project texts
    getProjectTexts: environment.baseUrl + endpoints.projectEndpoint + '/project-texts/',
    addProjectTexts: (projectId: number) => environment.baseUrl + endpoints.projectEndpoint + '/project-texts/' + projectId,
    updateProjectTexts: (projTextId: number) => environment.baseUrl + endpoints.projectEndpoint + '/project-texts/' + projTextId,
    deleteProjectTexts: (projTextId: number) => environment.baseUrl + endpoints.projectEndpoint + '/project-texts/' + projTextId,


    //Project images
    getProjectImages: environment.baseUrl + endpoints.projectEndpoint + '/project-images/',
    addImageToProject: (projectId: number) => environment.baseUrl + endpoints.projectEndpoint + '/project-images/' + projectId,
    deleteImage: (projImgId: number) => environment.baseUrl + endpoints.projectEndpoint + '/project-images/' + projImgId,

    //Drag and drop operations
    updateImageOrder: (projectId: number) => environment.baseUrl + endpoints.projectEndpoint + '/project-images-order/' + projectId,
    updateEditorOrder: (projectId: number) => environment.baseUrl + endpoints.projectEndpoint + '/project-editor-order/' + projectId,
  };
  