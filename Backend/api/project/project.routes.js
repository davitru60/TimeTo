const { Router } = require("express");
const router = Router();
const { ensureDropboxToken } = require("../../middlewares/dropboxToken");
const { uploadImageMiddleware,handleUploadImage, handleUpdateImage} = require('../../middlewares/uploadImage')
const midsJWT = require("../../middlewares/validateJWT")

const projectGeneral = require("./project-general/project-general.controller")
const category = require("./categories/category.controller")
const projectCategory = require("./project-categories/project-category.controller")
const projectText = require("./project-text/project-text.controller")
const projectImage = require("./project-image/project-image.controller")
const contentOrder = require("./content-order/content-order.controller")


// Usar el middleware antes de las rutas que necesiten acceso a Dropbox
router.use(ensureDropboxToken);

//General
router.get('/projects',projectGeneral.getAllProjects)
router.get('/recommended-projects', [midsJWT.validateJWT], projectGeneral.getRecommendedProjects)
router.get('/show-image',projectGeneral.showImage)
router.post('/projects', [uploadImageMiddleware,handleUploadImage],projectGeneral.createProject)
router.put('/projects/:id',[uploadImageMiddleware,handleUpdateImage], projectGeneral.updateProject)
router.delete('/projects/:id',projectGeneral.deleteProject)

//Categories
router.get('/category',category.getCategories)
router.post('/category',category.createCategory)
router.put('/category/:id',category.updateCategory)
router.delete('/category/:id',category.deleteCategory)

//Project categories
router.get('/project-category/:id',projectCategory.getProjectCategories)
router.post('/project-category',projectCategory.addProjectCategory)
router.delete('/project-category/:id',projectCategory.deleteProjectCategory)


//Project texts
router.get('/project-texts/:id',projectText.getProjectTexts)
router.post('/project-texts/:id',projectText.addProjectTexts)
router.put('/project-texts/:id',projectText.updateProjectTexts)
router.delete('/project-texts/:id',projectText.deleteProjectTexts)


//Project images
router.get('/project-images/:id',projectImage.getProjectImages)
router.post('/project-images/:id',[uploadImageMiddleware,handleUploadImage],projectImage.addImageToProject)
router.put('/project-images/:id',[uploadImageMiddleware,handleUpdateImage],projectImage.updateImageFromProject)
router.delete('/project-images/:id',projectImage.deleteImage)


//Content order
router.put('/project-images-order/:id',contentOrder.updateImageOrder)
router.put('/project-editor-order/:id',contentOrder.updateEditorOrder)

module.exports = router;
