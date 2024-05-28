const { StatusCodes } = require("http-status-codes");
const {uploadImageToDropbox} = require("../../../helpers/dropboxImageUploader")
const projectGeneral = require("./project-general.database");

class ProjectGeneralController {
  static getAllProjects = async (req, res) => {
    try {
      const projects = await projectGeneral.getAllProjects();

      for (let i = 0; i < projects.length; i++) {
        if (projects[i].path != null) {
          projects[i].path = `${process.env.REQUEST_URL}${process.env.PORT}${
            process.env.IMAGE_REQUEST
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
    } catch (error) {}
  };

  static updateProject = async (req, res) => {
    try {
      const projectId = req.params.id;
      const projectUpdate = await projectGeneral.updateProject(projectId, req.body);

      if (projectUpdate) {
        const response = {
          success: true,
          msg: "Project has been successfully updated",
        };

        res.status(StatusCodes.OK).json(response);
      } else {
        const response = {
          success: false,
          msg: "Failed to update project",
        };
        res.status(StatusCodes.BAD_REQUEST).json(response);
      }
    } catch (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: "Error editing project", detail: error });
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
