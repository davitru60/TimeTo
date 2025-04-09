const { check,body } = require("express-validator");
const validateFields = require('./validateFields');
const emailExists = require('./emailExists')



const loginValidator = [
  check("email", "Email is required").isEmail().normalizeEmail(),
  check("password", "Password is required").not().isEmpty().trim().escape(),
  validateFields
];

const registerValidator = [
  check("name", "Name is required").not().isEmpty().trim().escape(),
  check("first_surname", "First surname is required").not().isEmpty().trim().escape(),
  check("second_surname", "Second surname is required").not().isEmpty().trim().escape(),
  check("email", "Email is required").isEmail().normalizeEmail(),
  body('email').custom(emailExists),
  validateFields
];

module.exports = {
    loginValidator, registerValidator
}