const { StatusCodes } = require("http-status-codes");
const project = require("./project.database");
const Dropbox = require("dropbox").Dropbox;
const fetch = require("isomorphic-fetch");

const dbx = new Dropbox({
  accessToken: process.env.DROPBOX_TOKEN,
  fetch,
});

class ProjectController {
  static getAllProjects = async (req, res) => {
    try {
      // Obtener todos los proyectos
      const projects = await project.getAllProjects();

      for (let i = 0; i < projects.length; i++) {
        if (projects[i].path != null) {
          projects[i].path = `${process.env.REQUEST_URL}${process.env.PORT}${process.env.IMAGE_REQUEST}/show-image?path=${encodeURIComponent(
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

  static getProjectImages = async (req, res) => {
    try {
      const projectId = req.params.id;

      const imagePaths = await project.getProjectImages(projectId);

      // Mapear las rutas de las imágenes a URL de visualización en Dropbox
      const imageUrls = imagePaths.map(
        (entry) =>
          `${process.env.REQUEST_URL}${process.env.PORT}${
            process.env.IMAGE_REQUEST
          }/show-image?path=${encodeURIComponent(
            process.env.FOLDER_PATH + "/" + entry.dataValues.path
          )}`
      );

      res.status(StatusCodes.OK).json(imageUrls);
    } catch (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: "Error getting Dropbox images" });
    }
  };

  static showImage = async (req, res) => {
    try {
      const imagePath = req.query.path;
      const response = await dbx.filesDownload({ path: imagePath });

      res.set("Content-Type", response.result.fileBinary[".tag"]);

      // Enviar la imagen como respuesta
      res.send(response.result.fileBinary);
    } catch (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: "Error getting the image from Dropbox", error });
    }
  };
}

module.exports = ProjectController;
