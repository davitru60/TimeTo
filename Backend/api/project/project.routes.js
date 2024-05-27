const { Router } = require("express");
const router = Router();
const project = require("./project.controller")
const { ensureDropboxToken } = require("../../middlewares/dropboxToken");
const { uploadImageMiddleware,handleUploadImage} = require('../../middlewares/uploadImage')


// Usar el middleware antes de las rutas que necesiten acceso a Dropbox
router.use(ensureDropboxToken);

//General
router.get('/projects',project.getAllProjects)
router.get('/show-image',project.showImage)
router.post('/projects',[uploadImageMiddleware,handleUploadImage],project.createProject)
router.put('/projects/:id',project.updateProject)
router.delete('/projects/:id',project.deleteProject)

//Categories
router.get('/category',project.getCategories)
router.post('/category',project.createCategory)
router.put('/category/:id',project.updateCategory)
router.delete('/category/:id',project.deleteCategory)

//Project categories
router.get('/project-category/:id',project.getProjectCategories)
router.post('/project-category',project.addProjectCategory)
router.delete('/project-category/:id',project.deleteProjectCategory)


//Project texts
router.get('/project-texts/:id',project.getProjectTexts)
router.post('/project-texts/:id',project.addProjectTexts)
router.put('/project-texts/:id',project.updateProjectTexts)
router.delete('/project-texts/:id',project.deleteProjectTexts)


//Project images
router.get('/project-images/:id',project.getProjectImages)
router.post('/project-images/:id',[uploadImageMiddleware,handleUploadImage],project.addImageToProject)
router.delete('/project-images/:id',project.deleteImage)


//Content order
router.put('/project-images-order/:id',project.updateImageOrder)
router.put('/project-editor-order/:id',project.updateEditorOrder)

module.exports = router;
