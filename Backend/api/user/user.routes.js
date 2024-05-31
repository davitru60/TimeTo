const { Router } = require("express");
const router = Router();
const midsJWT = require("../../middlewares/validateJWT")
const user = require("./user.controller")

router.get('/user-interests',[midsJWT.validateJWT],user.getUserInterests)
router.post('/user-interests',[midsJWT.validateJWT],user.addUserInterest)
router.delete('/user-interests/:id',[midsJWT.validateJWT], user.deleteUserInterest)


module.exports = router;