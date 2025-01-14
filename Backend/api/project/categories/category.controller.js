const { StatusCodes } = require("http-status-codes");
const category = require("./category.database");
const responseHandler = require("../../../helpers/responseHandler");
const messages = require("../../../config/messages");

class CategoryController {
  static getCategories = async (req, res) => {
    try {
      const categories = await category.getCategories();
      responseHandler.success(res, messages.SUCCESS, { categories });
    } catch (error) {
      responseHandler.error(res, messages.INTERNAL_SERVER_ERROR, error, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  };

  static createCategory = async (req, res) => {
    try {
      const categoryCreate = await category.createCategory(req.body);

      if (categoryCreate) {
        responseHandler.success(res, messages.CREATE_SUCCESS, { categoryCreate });
      } else {
        responseHandler.error(res, messages.CREATE_FAILED, null, StatusCodes.BAD_REQUEST);
      }
    } catch (error) {
      responseHandler.error(res, messages.INTERNAL_SERVER_ERROR, error, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  };

  static updateCategory = async (req, res) => {
    try {
      const categoryId = req.params.id;
      const categoryUpdate = await category.updateCategory(categoryId, req.body);

      if (categoryUpdate) {
        responseHandler.success(res, messages.UPDATE_SUCCESS, { categoryUpdate });
      } else {
        responseHandler.error(res, messages.UPDATE_FAILED, null, StatusCodes.BAD_REQUEST);
      }
    } catch (error) {
      responseHandler.error(res, messages.INTERNAL_SERVER_ERROR, error, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  };

  static deleteCategory = async (req, res) => {
    try {
      const categoryId = req.params.id;
      const result = await category.deleteCategory(categoryId);

      if (result.success) {
        responseHandler.success(res, messages.DELETE_SUCCESS, { result });
      } else {
        responseHandler.error(res, messages.DELETE_FAILED, null, StatusCodes.BAD_REQUEST);
      }
    } catch (error) {
      responseHandler.error(res, messages.INTERNAL_SERVER_ERROR, error, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  };
}

module.exports = CategoryController;
