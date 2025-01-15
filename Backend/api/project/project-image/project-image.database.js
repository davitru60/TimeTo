const models = require("../../../models");
const queries = require("../project.queries");
const { Sequelize, QueryTypes } = require("sequelize");

class ProjectImage {
  static getProjectImages = async (projectId) => {
    try {
      const images = await models.ProjectImage.findAll({
        where: {
          project_id: projectId,
        },
        attributes: { exclude: ["id"] },
      });

      return images;
    } catch (error) {
      console.error("Error getting project images", error);
      throw error;
    }
  };

  static addImageToProject = async (projectId, imageOriginalName, body) => {
    const createdImages = [];

    try {
      for (const item of imageOriginalName) {
        const image = await models.sequelize.query(queries.addImageToProject, {
          replacements: {
            project_id: projectId,
            f_type_id: body.f_type_id,
            path: item,
            index: body.index,
          },
          type: QueryTypes.INSERT,
        });

        if (!image) {
          result = false;
          break;
        }

        createdImages.push(image);
      }
    } catch (error) {
      console.error("Error al crear la imagen:", error);
      result = false;
    }

    return createdImages;
  };

  static updateImageFromFile = async (body) => {
    try {  
      const imagePath = body.path[0];
  
      const image = await models.ProjectImage.findOne({
        where: {
          project_id: body.project_id,
        },
      });
  
      if (image) {
        await image.update({ path: imagePath })
      } else {
        throw new Error(`Image for project ID ${body.project_id} not found.`);
      }
  
      return image;
    } catch (error) {
      throw new Error(`Failed to update image from file: ${error.message}`);
    }
  };
  
  static updateImageFromBody = async (body) => {
    try {
    
      const imagePath = body.path;
  
      const image = await models.ProjectImage.findOne({
        where: {
          project_id: body.project_id,
        },
      });
  
      if (image) {
        await image.update({ path: imagePath });
      } else {
        throw new Error(`Image for project ID ${body.project_id} not found.`);
      }
  
      return image; // Devuelve la imagen actualizada
    } catch (error) {
      throw new Error(`Failed to update image from body: ${error.message}`);
    }
  };
  
  

  static deleteImage = async (projImgId) => {
    let result = true;

    try {
      const image = await models.ProjectImage.findOne({
        where: {
          proj_img_id: projImgId,
        },
        attributes: { exclude: ["id"] },
      });

      if (image) {
        await models.ProjectImage.destroy({
          where: {
            proj_img_id: projImgId,
          },
        });
        console.log("Imagen eliminada con éxito:", image);
      } else {
        console.warn("La imagen no se encontró con el ID:", projImgId);
        result = false;
      }
    } catch (error) {
      console.error("Error al eliminar la imagen:", error);
      result = false;
    }

    return result;
  };
}

module.exports = ProjectImage;
