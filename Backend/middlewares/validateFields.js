// middlewares/validateFields.js
const { validationResult } = require('express-validator');
const { StatusCodes } = require("http-status-codes");

const validateFields = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            msg: "Validation failed",
            errors: errors.array()
        });
    }
    next();
};

module.exports = validateFields;
