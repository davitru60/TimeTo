const { StatusCodes } = require("http-status-codes");
const projectText = require("./project-text.database");
const responseHandler = require("../../../helpers/responseHandler");
const messages = require("../../../config/messages");

class ProjectTextController {
  static getProjectTexts = async (req, res) => {
    try {
      const projectId = req.params.id;
    
      const texts = await projectText.getProjectTexts(projectId);
    
      responseHandler.success(res, messages.SUCCESS, { texts });
    } catch (error) {
      responseHandler.error(res, messages.INTERNAL_SERVER_ERROR, error, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  };

  static addProjectTexts = async (req, res) => {
    try {
      const projectId = req.params.id;
      const texts = await projectText.addProjectTexts(projectId, req.body);
    
      if (texts) {
        responseHandler.success(res, messages.ADD_TEXT_SUCCESS);
      } else {
        responseHandler.error(res, messages.ADD_TEXT_FAILED, null, StatusCodes.INTERNAL_SERVER_ERROR);
      }
    } catch (error) {
      responseHandler.error(res, messages.ADD_TEXT_FAILED, error, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  };

  static updateProjectTexts = async (req, res) => {
    try {
      const updatedText = await projectText.updateProjectTexts(req.body);
    
      if (updatedText) {
        responseHandler.success(res, messages.UPDATE_TEXT_SUCCESS, { updatedText });
      } else {
        responseHandler.error(res, messages.UPDATE_TEXT_FAILED, null, StatusCodes.BAD_REQUEST);
      }
    } catch (error) {
      console.error("Error updating", error);
      responseHandler.error(res, messages.UPDATE_TEXT_FAILED, error, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  };

  static deleteProjectTexts = async (req, res) => {
    try {
      const projTextId = req.params.id;
    
      const isDeleted = await projectText.deleteProjectTexts(projTextId);
    
      if (isDeleted) {
        responseHandler.success(res, messages.DELETE_TEXT_SUCCESS);
      } else {
        responseHandler.error(res, messages.DELETE_TEXT_FAILED, null, StatusCodes.BAD_REQUEST);
      }
    } catch (error) {
      console.error("Error deleting", error);
      responseHandler.error(res, messages.DELETE_TEXT_FAILED, error, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  };
}

module.exports = ProjectTextController;
