const { StatusCodes } = require("http-status-codes");
const project = require("./project.database");

class ProjectController {
  static getAllProjects = async (req, res) => {
    try {
      const projects = await project.getAllProjects();

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
      const projectId = await project.createProject(req.body);
      const imageOriginalNames = await ProjectController.uploadImageToDropbox(
        req
      );

      const projectImg = {
        project_id: projectId,
        path: imageOriginalNames,
      };

      const result = await project.addImageToProjectCreate(projectImg);

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
      const projectUpdate = await project.updateProject(projectId, req.body);

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
      const projectDelete = await project.deleteProject(projectId);

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

  static getCategories = async (req, res) => {
    try {
      const categories = await project.getCategories();

      const response = {
        success: true,
        data: {
          categories: categories,
        },
      };
      res.status(StatusCodes.OK).json(response);
    } catch (error) {
      throw new Error("Error getting categories");
    }
  };

  static createCategory = async (req, res) => {
    try {
      const category = await project.createCategory(req.body);

      if (category) {
        const response = {
          success: true,
          msg: "Project has been successfully created",
        };

        res.status(StatusCodes.OK).json(response);
      } else {
        const response = {
          success: false,
          msg: "Failed to create project",
        };
        res.status(StatusCodes.BAD_REQUEST).json(response);
      }
    } catch (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: "Error adding category", detail: error });
    }
  };

  static updateCategory = async (req, res) => {
    try {
      const categoryId = req.params.id;
      const categoryUpdate = await project.updateCategory(categoryId, req.body);

      if (categoryUpdate) {
        const response = {
          success: true,
          msg: "Category has been successfully updated",
        };
        res.status(StatusCodes.OK).json(response);
      } else {
        const response = {
          success: false,
          msg: "Failed to update category",
        };
        res.status(StatusCodes.BAD_REQUEST).json(response);
      }
    } catch (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: "Error upadting category", detail: error });
    }
  };

  static deleteCategory = async (req, res) => {
    try {
      const categoryId = req.params.id;
      const categoryDelete = await project.deleteCategory(categoryId);

      if (categoryDelete) {
        const response = {
          success: true,
          msg: "Category has been successfully deleted",
        };

        res.status(StatusCodes.OK).json(response);
      } else {
        const response = {
          success: false,
          msg: "Failed to delete category",
        };
        res.status(StatusCodes.BAD_REQUEST).json(response);
      }
    } catch (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: "Error deleting category", detail: error });
    }
  };

  static getProjectCategories = async (req, res) => {
    try {
      const projectId = req.params.id;
      const projectCategories = await project.getProjectCategories(projectId);

      const response = {
        success: true,
        data: {
          projectCategories: projectCategories,
        },
      };

      res.status(StatusCodes.OK).json(response);
    } catch (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: "Error getting categories", detail: error });
    }
  };

  static addProjectCategory = async (req, res) => {
    try {
      const projectCategory = await project.addProjectCategory(req.body)

      if(projectCategory){
        const response = {
          success: true,
          msg: "Project category has been successfully added",
        };

        res.status(StatusCodes.OK).json(response);
      }else{
        const response = {
          success: false,
          msg: "Failed to update project category",
        };
        res.status(StatusCodes.BAD_REQUEST).json(response);
      }

    } catch (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: "Error creating project categories", detail: error });
    }
  };

  static deleteProjectCategory = async(req,res) =>{
    try {
      const projCatId = req.params.id;
      const categoryDelete = await project.deleteProjectCategory(projCatId);

      if (categoryDelete) {
        const response = {
          success: true,
          msg: "Category has been successfully deleted",
        };

        res.status(StatusCodes.OK).json(response);
      } else {
        const response = {
          success: false,
          msg: "Failed to delete category",
        };
        res.status(StatusCodes.BAD_REQUEST).json(response);
      }
    } catch (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: "Error deleting category", detail: error });
    }
  }

  static getProjectTexts = async (req, res) => {
    try {
      const projectId = req.params.id;

      const texts = await project.getProjectTexts(projectId);

      const response = {
        success: true,
        data: {
          texts: texts,
        },
      };
      res.status(StatusCodes.OK).json(response);
    } catch (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: "Error getting project texts", detail: error });
    }
  };

  static addProjectTexts = async (req, res) => {
    try {
      const projectId = req.params.id;
      const texts = await project.addProjectTexts(projectId, req.body);

      if (texts) {
        res.status(StatusCodes.OK).json({
          success: true,
          message: "Project texts added successfully.",
        });
      } else {
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ success: false, message: "Failed to add project texts" });
      }
    } catch (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: "Error adding project texts", detail: error });
    }
  };

  static updateProjectTexts = async (req, res) => {
    try {
      const updatedText = project.updateProjectTexts(req.body);

      if (updatedText) {
        const response = {
          success: true,
          msg: "Text has been successfully updated",
        };

        res.status(StatusCodes.OK).json(response);
      } else {
        const response = {
          success: false,
          msg: "Failed to update text",
        };
        res.status(StatusCodes.BAD_REQUEST).json(response);
      }
    } catch (error) {
      console.error("Error updating", error);
      const response = {
        success: false,
        msg: "Failed to update text",
      };
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response);
    }
  };

  static deleteProjectTexts = async (req, res) => {
    try {
      const projTextId = req.params.id;

      const isDeleted = await project.deleteProjectTexts(projTextId);

      if (isDeleted) {
        const response = {
          success: true,
          msg: "Text has been successfully deleted",
        };
        res.status(StatusCodes.OK).json(response);
      } else {
        const response = {
          success: false,
          msg: "Failed to delete text",
        };
        res.status(StatusCodes.BAD_REQUEST).json(response);
      }
    } catch (error) {
      console.error("Error deleting", error);
      const response = {
        success: false,
        msg: "Failed to delete text",
      };
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response);
    }
  };

  static getProjectImages = async (req, res) => {
    try {
      const projectId = req.params.id;

      const images = await project.getProjectImages(projectId);
      console.log(images);

      // Mapear las rutas de las imágenes a URL de visualización en Dropbox
      images.forEach((entry) => {
        const imagePath = entry.dataValues.path;
        const imageUrl = `${process.env.REQUEST_URL}${process.env.PORT}${
          process.env.IMAGE_REQUEST
        }/show-image?path=${encodeURIComponent(
          process.env.FOLDER_PATH + "/" + imagePath
        )}`;

        entry.dataValues.path = imageUrl;
      });

      const response = {
        success: true,
        data: {
          images: images,
        },
      };

      res.status(StatusCodes.OK).json(response);
    } catch (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: "Error getting Dropbox images" });
    }
  };

  static addImageToProject = async (req, res) => {
    try {
      const projectId = req.params.id;
      const imageOriginalNames = await ProjectController.uploadImageToDropbox(
        req
      );
      const result = await project.addImageToProject(
        projectId,
        imageOriginalNames,
        req.body
      );

      res.status(StatusCodes.OK).json({
        success: true,
        data: {
          result: result,
        },
        message: "Images uploaded successfully.",
      });
    } catch (error) {
      console.error("Error adding images to project:", error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: "Error adding images to project",
        detail: error,
      });
    }
  };

  static deleteImage = async (req, res) => {
    try {
      const projImgId = req.params.id;

      const isDeleted = await project.deleteImage(projImgId);

      if (isDeleted) {
        const response = {
          success: true,
          msg: "Image has been successfully deleted",
        };
        res.status(StatusCodes.OK).json(response);
      } else {
        const response = {
          success: false,
          msg: "Failed to delete image",
        };
        res.status(StatusCodes.BAD_REQUEST).json(response);
      }
    } catch (error) {
      console.error("Error deleting image:", error);
      const response = {
        success: false,
        msg: "Failed to delete image due to server error",
      };
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response);
    }
  };

  static uploadImageToDropbox = async (req) => {
    try {
      if (!req.files || req.length === 0) {
        console.log("Images hasn't been provided");
      }

      const dbx = req.dbx;

      const imageUrls = [];
      const imageOriginalNames = [];

      for (let i = 0; i < req.files.length; i++) {
        const file = req.files[i];
        const response = await dbx.filesUpload({
          path: `/Fotos/${file.originalname}`,
          contents: file.buffer,
        });

        imageUrls.push(response.result.path_display);
        imageOriginalNames.push(file.originalname);
      }

      return imageOriginalNames;
    } catch (error) {
      console.error("Error uploading images:", error);
    }
  };

  static updateImageOrder = async (req, res) => {
    try {
      const projectId = req.params.id;

      const updatedOrder = project.updateImageOrder(projectId, req.body);

      if (updatedOrder) {
        const response = {
          success: true,
          msg: "Images order has been successfully updated",
        };

        res.status(StatusCodes.OK).json(response);
      } else {
        const response = {
          success: false,
          msg: "Failed to update image order",
        };
        res.status(StatusCodes.BAD_REQUEST).json(response);
      }
    } catch (error) {
      console.error("Error updating", error);
      const response = {
        success: false,
        msg: "Failed to update image order",
      };
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response);
    }
  };

  static updateEditorOrder = async (req, res) => {
    try {
      const projectId = req.params.id;

      const updatedOrder = project.updateEditorOrder(projectId, req.body);

      if (updatedOrder) {
        const response = {
          success: true,
          msg: "Editor order has been successfully updated",
        };

        res.status(StatusCodes.OK).json(response);
      } else {
        const response = {
          success: false,
          msg: "Failed to update editor order",
        };
        res.status(StatusCodes.BAD_REQUEST).json(response);
      }
    } catch (error) {
      console.error("Error updating", error);
      const response = {
        success: false,
        msg: "Failed to update editor order",
      };
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response);
    }
  };
}

module.exports = ProjectController;
