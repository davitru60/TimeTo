const models = require("../../models");
const { Sequelize } = require("sequelize");

class Project {
  static getAllProjects = async () => {
    try {
      const projects = await models.sequelize.query(
        `SELECT p.project_id,p.name,p.description,pi.path from home_project_imgs hpi JOIN project_images pi ON hpi.project_img_id = pi.proj_img_id JOIN projects p ON hpi.project_id = p.project_id;`,
        { type: Sequelize.QueryTypes.SELECT }
      );
      return projects;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

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

  static uploadImage = async (projectId, body) => {
    let result = true;
    const createdImages = [];

    try {
      for (const item of body) {
        const image = await models.ProjectImage.create({
          path: item,
          project_id: projectId,
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

    return {
      success: result,
      createdImages,
    };
  };

  static getProjectTexts = async (projectId) => {
    try {
      const texts = await models.ProjectText.findAll({
        where: {
          project_id: projectId,
        },
        attributes: { exclude: ["id"] },
      });

      return texts;
    } catch (error) {
      console.error("Error getting project texts", error);
      throw error;
    }
  };

  static updateImageOrder = async (projectId, body) => {
    let result = true;
    console.log("Imagenes a ordenar", body);

    try {
      const image = await models.ProjectImage.findOne({
        where: {
          proj_img_id: body.proj_img_id,
          project_id: projectId,
          index: body.previousIndex,
        },
        attributes: { exclude: ["id"] },
      });

      if (image) {
        await models.ProjectImage.update(
          { index: body.newIndex },
          {
            where: {
              project_id: projectId,
              index: body.previousIndex,
            },
          }
        );
        result = true;
      } else {
        result = false;
      }
    } catch (error) {
      console.error("Error updating the image order", error);
    }

    return result;
  };

  static updateEditorOrder = async (projectId, body) => {
    let result = true;

    try {
      const image = await models.ProjectText.findOne({
        where: {
          proj_text_id: body.proj_text_id,
          project_id: projectId,
          index: body.previousIndex,
        },
        attributes: { exclude: ["id"] },
      });

      if (image) {
        await models.ProjectText.update(
          { index: body.newIndex },
          {
            where: {
              project_id: projectId,
              index: body.previousIndex,
            },
          }
        );
        result = true;
      } else {
        result = false;
      }
    } catch (error) {
      console.error("Error updating the image order", error);
    }

    return result;
  };
}

module.exports = Project;
