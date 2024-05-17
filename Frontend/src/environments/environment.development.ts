export const environment = {
    baseUrl: 'http://localhost:9090/api',
    googleClientId: '659893836575-kkd9rsiavi6od7j6pv5ko84usog4gaas.apps.googleusercontent.com'
}

export const endpoints ={
    authEndpoint: '/auth',
    projectEndpoint: '/projects',
}

export const authRoutes = {
    login:'/login',
    register: '/register',
    googleSignIn: '/google-sign-in'
}

export const projectRoutes = {
    getAllProjects: '/projects',
    getProjectImages: '/project-images/',
    createProject: '/projects',
    getProjectTexts: '/project-texts/',
    updateProjectTexts: '/project-texts/',
    addImageToProject: '/project-images/',
    deleteImage: '/project-images/',
    addProjectEditor: '/project-editor',
    updateImageOrder: '/project-images-order/',
    updateEditorOrder: '/project-editor-order/',

}