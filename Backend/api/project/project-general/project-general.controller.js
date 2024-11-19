const { StatusCodes } = require("http-status-codes");
const {uploadImageToDropbox,} = require("../../../helpers/dropboxImageUploader");
const projectGeneral = require("./project-general.database");
const category = require("../categories/category.database");
const projectCategory = require("../project-categories/project-category.database");

class ProjectGeneralController {
  static getAllProjects = async (req, res) => {
    try {
      const projects = await projectGeneral.getAllProjects();

      for (let i = 0; i < projects.length; i++) {
        if (projects[i].path != null) {
          projects[i].path = `${process.env.REQUEST_URL}${process.env.PORT}${process.env.IMAGE_REQUEST
            }/show-image?path=${encodeURIComponent(
              process.env.FOLDER_PATH + "/" + projects[i].path
            )}`;
        }
      }

      const response = {
        success: true,
        data: {
          projects: projects,
        },
      };
      res.status(StatusCodes.OK).json(response);
    } catch (error) {
      throw new Error("Error getting projects");
    }
  };

  static getRecommendedProjects = async (req, res) => {
    try {
      const userId = req.tokenId;

      const categoriesDatavalues = await category.getCategories();
      const projectCategoriesDatavalues =
        await projectCategory.getProjectsCategories();
      const userInterestsDatavalues = await projectGeneral.getUserInterests();

      const projects = await projectGeneral.getAllProjects();

      let categories = [];
      for (let i = 0; i < categoriesDatavalues.length; i++) {
        categories.push(categoriesDatavalues[i].dataValues);
      }

      let projectCategories = [];
      for (let i = 0; i < projectCategoriesDatavalues.length; i++) {
        projectCategories.push(projectCategoriesDatavalues[i].dataValues);
      }

      let userInterests = [];
      for (let i = 0; i < userInterestsDatavalues.length; i++) {
        userInterests.push(userInterestsDatavalues[i].dataValues);
      }

      // Filtrar intereses del usuario específico
      const userCategoryInterests = userInterests
        .filter((interest) => interest.user_id === userId)
        .map((interest) => interest.category_id);

      // Encontrar proyectos que coincidan con los intereses del usuario
      const recommendedProjects = projects.filter((project) => {
        const projectCategoryIds = projectCategories
          .filter((pc) => pc.project_id === project.project_id)
          .map((pc) => pc.category_id);

        return projectCategoryIds.some((categoryId) =>
          userCategoryInterests.includes(categoryId)
        );
      });

      for (let i = 0; i < recommendedProjects.length; i++) {
        if (recommendedProjects[i].path != null) {
          recommendedProjects[i].path = `${process.env.REQUEST_URL}${process.env.PORT
            }${process.env.IMAGE_REQUEST}/show-image?path=${encodeURIComponent(
              process.env.FOLDER_PATH + "/" + recommendedProjects[i].path
            )}`;
        }
      }

      const response = {
        success: true,
        data: {
          recommendedProjects: recommendedProjects,
        },
      };

      res.status(StatusCodes.OK).json(response);
    } catch (error) {
      console.error("Error getting recommended projects:", error);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: "Internal server error" });
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
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Error retrieving image from Dropbox.",
        detail: error,
      });
    }
  };

  static createProject = async (req, res) => {
    try {
      const projectId = await projectGeneral.createProject(req.body);
      const imageOriginalNames = await uploadImageToDropbox(req);

      const projectImg = {
        project_id: projectId,
        path: imageOriginalNames,
      };

      const result = await projectGeneral.addImageToProjectCreate(projectImg);

      if (result) {
        res
          .status(StatusCodes.OK)
          .json({ success: true, message: "Project created successfully." });
      } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: "Failed to add images to the project",
        });
      }
    } catch (error) { }
  };

  static updateProject = async (req, res) => {
    try {
      const projectId = req.params.id;
      let updatedImage = null;

      if (req.files) {
        const imageOriginalName = await uploadImageToDropbox(req);

        const projectImg = {
          project_id: projectId,
          path: imageOriginalName,
        };

        updatedImage = await projectGeneral.updateProjectHomeImage(projectImg);
      }

      const projectUpdate = await projectGeneral.updateProject(
        projectId,
        req.body
      );

      if (projectUpdate !== null) {
        const response = {
          success: true,
          msg: "Project has been successfully updated",
          data: {
            updatedImage,
            project: projectUpdate,
          },
        };

        res.status(StatusCodes.OK).json(response);
      } else {
        throw new Error("Failed to update project");
      }
    } catch (error) {
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        error: "Error editing project",
        detail: error.message,
      });
    }
  };

  static deleteProject = async (req, res) => {
    try {
      const projectId = req.params.id;
      const projectDelete = await projectGeneral.deleteProject(projectId);

      if (projectDelete) {
        const response = {
          success: true,
          msg: "Project has been successfully deleted",
        };

        res.status(StatusCodes.OK).json(response);
      } else {
        const response = {
          success: false,
          msg: "Failed to delete project",
        };
        res.status(StatusCodes.BAD_REQUEST).json(response);
      }
    } catch {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: "Error deleting project", detail: error });
    }
  };
}

module.exports = ProjectGeneralController;
