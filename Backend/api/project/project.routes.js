const { Router } = require("express");
const router = Router();
const project = require("./project.controller")

const { ensureDropboxToken } = require("../../middlewares/dropboxToken");

// Usar el middleware antes de las rutas que necesiten acceso a Dropbox
router.use(ensureDropboxToken);



router.get('/projects',project.getAllProjects)
router.get('/project-images/:id',project.getProjectImages)
router.get('/show-image',project.showImage)
router.post('/upload-image/:id',project.uploadImage)

router.get('/project-texts/:id',project.getProjectTexts)

router.put('/project-images-order/:id',project.updateImageOrder)
router.put('/project-editor-order/:id',project.updateEditorOrder)

router.delete('/project-images/:id',project.deleteImage)



module.exports = router;
