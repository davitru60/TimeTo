const { Router } = require("express");
const router = Router();
const auth = require("./auth.controller");

const { check, body } = require("express-validator");
//const validateFields = require('../../middlewares/validateFields');
//const emailExists = require( "../../middlewares/emailExists" );

const validator= [

]


router.post("/login", auth.login);
router.post("/register",auth.register)

module.exports = router;