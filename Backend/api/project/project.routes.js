const { Router } = require("express");
const router = Router();
const project = require("./project.controller")
const { ensureDropboxToken } = require("../../middlewares/dropboxToken");
const { uploadImageMiddleware,handleUploadImage} = require('../../middlewares/uploadImage')


// Usar el middleware antes de las rutas que necesiten acceso a Dropbox
router.use(ensureDropboxToken);


//General
router.get('/projects',project.getAllProjects)
router.get('/project-images/:id',project.getProjectImages)
router.get('/show-image',project.showImage)
router.post('/projects',[uploadImageMiddleware,handleUploadImage],project.createProject)

//Project texts
router.get('/project-texts/:id',project.getProjectTexts)
//router.post('/project-texts/:id',project.addTextEditor)


//Project images
router.post('/project-images/:id',[uploadImageMiddleware,handleUploadImage],project.addImageToProject)
router.delete('/project-images/:id',project.deleteImage)


//Content order
router.put('/project-images-order/:id',project.updateImageOrder)
router.put('/project-editor-order/:id',project.updateEditorOrder)





module.exports = router;
