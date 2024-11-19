const { Router } = require("express");
const router = Router();
const auth = require("./auth.controller");
const {loginValidator,registerValidator} = require('../../middlewares/validators')



router.post("/login",loginValidator, auth.login);
router.post("/google-sign-in", auth.googleSignIn)
router.post("/register",registerValidator,auth.register)

module.exports = router;
