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

  static updateImageFromProject = async(body) =>{
    try{

      const image = await models.ProjectImage.findOne({
        where: {
          project_id: body.project_id
        }
      });
      if(image){
        await image.update({
          path: body.path[0]
        })
      }

      return image

    }catch(error){
      throw new Error(`Failed to update image: ${error.message}`);
    }
  }

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
