const { StatusCodes } = require("http-status-codes");
const { uploadImageToDropbox } = require("../../../helpers/dropboxImageUploader");
const projectGeneral = require("./project-general.database");
const category = require("../categories/category.database");
const projectCategory = require("../project-categories/project-category.database");
const responseHandler = require("../../../helpers/responseHandler");
const messages = require("../../../config/messages");

class ProjectGeneralController {
  static getAllProjects = async (req, res) => {
    try {
      const projects = await projectGeneral.getAllProjects();

      for (let i = 0; i < projects.length; i++) {
        if (projects[i].path != null) {
          projects[i].path = `${process.env.REQUEST_URL}${process.env.PORT}${process.env.IMAGE_REQUEST}/show-image?path=${encodeURIComponent(process.env.FOLDER_PATH + "/" + projects[i].path)}`;
        }
      }

      responseHandler.success(res, messages.SUCCESS, { projects });
    } catch (error) {
      responseHandler.error(res, messages.INTERNAL_SERVER_ERROR, error, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  };

  static getRecommendedProjects = async (req, res) => {
    try {
      const userId = req.tokenId;

      const categoriesDatavalues = await category.getCategories();
      const projectCategoriesDatavalues = await projectCategory.getProjectsCategories();
      const userInterestsDatavalues = await projectGeneral.getUserInterests();

      const projects = await projectGeneral.getAllProjects();

      let categories = categoriesDatavalues.map(category => category.dataValues);
      let projectCategories = projectCategoriesDatavalues.map(pc => pc.dataValues);
      let userInterests = userInterestsDatavalues.map(interest => interest.dataValues);

      // Filtrar intereses del usuario específico
      const userCategoryInterests = userInterests.filter(interest => interest.user_id === userId).map(interest => interest.category_id);

      // Encontrar proyectos que coincidan con los intereses del usuario
      const recommendedProjects = projects.filter(project => {
        const projectCategoryIds = projectCategories.filter(pc => pc.project_id === project.project_id).map(pc => pc.category_id);
        return projectCategoryIds.some(categoryId => userCategoryInterests.includes(categoryId));
      });

      for (let i = 0; i < recommendedProjects.length; i++) {
        if (recommendedProjects[i].path != null) {
          recommendedProjects[i].path = `${process.env.REQUEST_URL}${process.env.PORT}${process.env.IMAGE_REQUEST}/show-image?path=${encodeURIComponent(process.env.FOLDER_PATH + "/" + recommendedProjects[i].path)}`;
        }
      }

      responseHandler.success(res, messages.SUCCESS, { recommendedProjects });
    } catch (error) {
      console.error("Error getting recommended projects:", error);
      responseHandler.error(res, messages.INTERNAL_SERVER_ERROR, error, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  };

  static showImage = async (req, res) => {
    try {
      const dbx = req.dbx;
      if (!dbx) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
          success: false,
          message: "Dropbox client not found. Authentication required.",
        });
      }

      const imagePath = req.query.path;
      if (!imagePath) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: "No image path provided.",
        });
      }

      const response = await dbx.filesDownload({ path: imagePath });

      if (!response.result.fileBinary) {
        return res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          message: "Image not found in Dropbox.",
        });
      }

      res.set("Content-Type", response.result.fileBinary[".tag"]);
      res.send(response.result.fileBinary);
    } catch (error) {
      console.error("Error in showImage:", error);
      responseHandler.error(res, messages.INTERNAL_SERVER_ERROR, error, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  };

  static createProject = async (req, res) => {
    try {
      const projectId = await projectGeneral.createProject(req.body);
      const imageOriginalNames = await uploadImageToDropbox(req);

      const projectImg = { project_id: projectId, path: imageOriginalNames };

      const result = await projectGeneral.addImageToProjectCreate(projectImg);

      if (result) {
        responseHandler.success(res, messages.CREATE_SUCCESS);
      } else {
        responseHandler.error(res, messages.CREATE_FAILED, null, StatusCodes.INTERNAL_SERVER_ERROR);
      }
    } catch (error) {
      responseHandler.error(res, messages.INTERNAL_SERVER_ERROR, error, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  };

  static updateProject = async (req, res) => {
    try {
      const projectId = req.params.id;
      let updatedImage = null;

      if (req.files) {
        const imageOriginalName = await uploadImageToDropbox(req);
        const projectImg = { project_id: projectId, path: imageOriginalName };
        updatedImage = await projectGeneral.updateProjectHomeImage(projectImg);
      }

      const projectUpdate = await projectGeneral.updateProject(projectId, req.body);

      if (projectUpdate !== null) {
        responseHandler.success(res, messages.UPDATE_SUCCESS, { updatedImage, project: projectUpdate });
      } else {
        responseHandler.error(res, messages.UPDATE_FAILED, null, StatusCodes.BAD_REQUEST);
      }
    } catch (error) {
      responseHandler.error(res, messages.INTERNAL_SERVER_ERROR, error, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  };

  static updateProjectHomeImage = async (req, res) => {
    try {
      const projectId = req.params.id;
      const path = req.body.path;

      const projectImg = { project_id: projectId, path: path };

      const updatedImage = await projectGeneral.updateProjectHomeImage(projectImg);

      responseHandler.success(res, messages.UPDATE_SUCCESS, { updatedImage });
    } catch (error) {
      console.error("Error updating project image:", error);
      responseHandler.error(res, messages.INTERNAL_SERVER_ERROR, error, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  };

  static deleteProject = async (req, res) => {
    try {
      const projectId = req.params.id;
      const projectDelete = await projectGeneral.deleteProject(projectId);

      if (projectDelete) {
        responseHandler.success(res, messages.DELETE_SUCCESS);
      } else {
        responseHandler.error(res, messages.DELETE_FAILED, null, StatusCodes.BAD_REQUEST);
      }
    } catch (error) {
      responseHandler.error(res, messages.INTERNAL_SERVER_ERROR, error, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  };
}

module.exports = ProjectGeneralController;
