const { Router } = require("express");
const router = Router();
const auth = require("./auth.controller");

const { check, body } = require("express-validator");

router.post("/login", auth.login);

module.exports = router;
