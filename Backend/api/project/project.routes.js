const { Router } = require("express");
const router = Router();
const project = require("./project.controller")

router.get('/get-project-images/:id',project.getProjectImages)
router.get('/show-image',project.showImage)

module.exports = router;
