const { StatusCodes } = require("http-status-codes");
const projectCategory = require("./project-category.database");
const responseHandler = require("../../../helpers/responseHandler");
const messages = require("../../../config/messages");

class ProjectCategoryController {
  static getProjectCategories = async (req, res) => {
    try {
      const projectId = req.params.id;
      const projectCategories = await projectCategory.getProjectCategories(projectId);

      responseHandler.success(res, messages.SUCCESS, { projectCategories });
    } catch (error) {
      responseHandler.error(res, messages.INTERNAL_SERVER_ERROR, error, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  };

  static addProjectCategory = async (req, res) => {
    try {
      const projectCategoryAdd = await projectCategory.addProjectCategory(req.body);

      if (projectCategoryAdd) {
        responseHandler.success(res, messages.CREATE_SUCCESS, { projectCategoryAdd });
      } else {
        responseHandler.error(res, messages.CREATE_FAILED, null, StatusCodes.BAD_REQUEST);
      }
    } catch (error) {
      responseHandler.error(res, messages.INTERNAL_SERVER_ERROR, error, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  };

  static deleteProjectCategory = async (req, res) => {
    try {
      const projCatId = req.params.id;
      const categoryDelete = await projectCategory.deleteProjectCategory(projCatId);

      if (categoryDelete) {
        responseHandler.success(res, messages.DELETE_SUCCESS);
      } else {
        responseHandler.error(res, messages.DELETE_FAILED, null, StatusCodes.BAD_REQUEST);
      }
    } catch (error) {
      responseHandler.error(res, messages.INTERNAL_SERVER_ERROR, error, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  };
}

module.exports = ProjectCategoryController;
