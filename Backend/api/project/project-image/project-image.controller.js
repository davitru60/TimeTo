const { StatusCodes } = require("http-status-codes");
const { uploadImageToDropbox } = require("../../../helpers/dropboxImageUploader");
const { getImagesFromDropbox } = require("../../../helpers/getImagesFromDropbox");
const projectImage = require("./project-image.database");
const responseHandler = require("../../../helpers/responseHandler");
const messages = require("../../../config/messages");

class ProjectImageController {
  static getImages = async (req, res) => {
    try {
      const dbx = req.dbx;
      const folderPath = process.env.FOLDER_PATH;

      const images = await getImagesFromDropbox(dbx, folderPath);

      responseHandler.success(res, messages.SUCCESS, { images });
    } catch (error) {
      responseHandler.error(res, messages.INTERNAL_SERVER_ERROR, error, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  };

  static getProjectImages = async (req, res) => {
    try {
      const projectId = req.params.id;

      const images = await projectImage.getProjectImages(projectId);

      // Mapear las rutas de las imágenes a URL de visualización en Dropbox
      images.forEach((entry) => {
        const imagePath = entry.dataValues.path;
        const imageUrl = `${process.env.REQUEST_URL}${process.env.PORT}${process.env.IMAGE_REQUEST}/show-image?path=${encodeURIComponent(process.env.FOLDER_PATH + "/" + imagePath)}`;
        entry.dataValues.path = imageUrl;
      });

      responseHandler.success(res, messages.SUCCESS, { images });
    } catch (error) {
      responseHandler.error(res, messages.INTERNAL_SERVER_ERROR, error, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  };

  static addImageToProject = async (req, res) => {
    try {
      const projectId = req.params.id;
      const imageOriginalNames = await uploadImageToDropbox(req);
      const result = await projectImage.addImageToProject(projectId, imageOriginalNames, req.body);

      responseHandler.success(res, messages.UPLOAD_SUCCESS, { result });
    } catch (error) {
      console.error("Error adding images to project:", error);
      responseHandler.error(res, messages.UPLOAD_FAILED, error, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  };

  static updateImageFromProject = async (req, res) => {
  const projectId = req.params.id;
  let updatedImage = null;

  try {
    // Si la imagen llega por `req.files`
    if (req.files) {
      const imageOriginalName = await uploadImageToDropbox(req);
      const projectImg = { project_id: projectId, path: imageOriginalName };

      updatedImage = await projectImage.updateImageFromFile(projectImg);
    } 
    // Si la imagen llega por `req.body`
    else if (req.body && req.body.image) {
      const projectImg = { project_id: projectId, path: req.body.image };

      updatedImage = await projectImage.updateImageFromBody(projectImg);
    } 
    // Si no se recibe ninguna imagen
    else {
      return responseHandler.error(
        res,
        "No image provided in request",
        null,
        StatusCodes.BAD_REQUEST
      );
    }

    // Verifica si la actualización fue exitosa
    if (updatedImage) {
      responseHandler.success(res, messages.UPDATE_SUCCESS, { updatedImage });
    } else {
      responseHandler.error(res, messages.UPDATE_FAILED, null, StatusCodes.BAD_REQUEST);
    }
  } catch (error) {
    responseHandler.error(res, messages.INTERNAL_SERVER_ERROR, error, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};


  static deleteImage = async (req, res) => {
    try {
      const projImgId = req.params.id;

      const isDeleted = await projectImage.deleteImage(projImgId);

      if (isDeleted) {
        responseHandler.success(res, messages.DELETE_SUCCESS);
      } else {
        responseHandler.error(res, messages.DELETE_FAILED, null, StatusCodes.BAD_REQUEST);
      }
    } catch (error) {
      console.error("Error deleting image:", error);
      responseHandler.error(res, messages.INTERNAL_SERVER_ERROR, error, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  };
}

module.exports = ProjectImageController;
