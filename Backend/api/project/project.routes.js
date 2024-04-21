const { Router } = require("express");
const router = Router();
const project = require("./project.controller")

router.get('/projects',project.getAllProjects)
router.get('/project-images/:id',project.getProjectImages)
router.get('/show-image',project.showImage)

module.exports = router;
