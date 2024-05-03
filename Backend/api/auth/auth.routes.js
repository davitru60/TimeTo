const { Router } = require("express");
const router = Router();
const auth = require("./auth.controller");

const { check, body } = require("express-validator");
//const validateFields = require('../../middlewares/validateFields');
//const emailExists = require( "../../middlewares/emailExists" );


router.post("/login", auth.login);
router.post("/google-sign-in", auth.googleSignIn)
router.post("/register",auth.register)

module.exports = router;
