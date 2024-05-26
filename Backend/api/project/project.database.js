const models = require("../../models");
const { Sequelize, QueryTypes } = require("sequelize");
const queries = require("./project.queries");

class Project {
  static getAllProjects = async () => {
    try {
      const projects = await models.sequelize.query(queries.getAllProjects, {
        type: Sequelize.QueryTypes.SELECT,
      });
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

  static createProject = async (body) => {
    const project = await models.sequelize.query(queries.createProject, {
      replacements: {
        name: body.name,
        description: body.description,
      },
      type: QueryTypes.INSERT,
    });

    return project[0];
  };

  static updateProject = async (projectId, body) => {
    let result = false;

    try {
      const project = await models.Project.findByPk(projectId);

      if (project) {
        await project.update(body);

        result = true;
      }
    } catch (error) {
      console.error("Error al actualizar el texto:", error);
    }

    return result;
  };

  static deleteProject = async (projectId) => {
    let result = false;
    try {
      const project = await models.Project.findByPk(projectId);
      console.log("PROJECT", project);

      const projectHomeImgs = await models.HomeProjectImage.findAll({
        where: {
          project_id: projectId,
        },
      });

      console.log("Projimag", projectHomeImgs);

      if (project && projectHomeImgs.length > 0) {
        for (const projectHomeImg of projectHomeImgs) {
          await projectHomeImg.destroy();
        }
        await project.destroy();

        result = true;
      } else if (project) {
        await project.destroy();
        result = true;
      }
    } catch (error) {
      console.error("Error deleting project:", error);
    }

    return result;
  };

  static getProjectCategories = async() =>{
    try {
      const categories = await models.Category.findAll()
      return categories;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static createProjectCategory = async(body) =>{
    let result = false
    try{
      console.log(body)
      const newCategory = await models.Category.create({
        name: body.name,
      });

      if (newCategory) {
        result = true;
      }


    }catch(error){
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Error adding category", detail: error });
    }

    return result;
  }

  static updateProjectCategory = async(categoryId,body) =>{
    let result = false
    try{
      const category = await models.Category.findByPk(categoryId)

      if(category){
        result=true
        await category.update(body)
      }else{
        result=false
      }

    }catch(error){

    }

    return result
  }

  static deleteProjectCategory = async(categoryId) =>{
    let result = false

    try{
      const category = await models.Category.findByPk(categoryId)

      if(category){
        result=true
        await category.destroy()
      }else{
        result=false
      }

    }catch(error){

    }

    return result

  }

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

  static addProjectTexts = async (projectId, body) => {
    let result = false;

    try {
      const texts = await models.ProjectText.create({
        ...body,
        project_id: projectId,
      });

      texts ? (result = true) : (result = false);
    } catch (error) {
      console.error("Error al añadir el texto:", error);
    }

    return result;
  };

  static updateProjectTexts = async (body) => {
    let result = false;

    try {
      const text = await models.ProjectText.findByPk(body.proj_text_id);

      if (text) {
        await text.update(body);

        result = true;
      }
    } catch (error) {
      console.error("Error al actualizar el texto:", error);
    }

    return result;
  };

  static deleteProjectTexts = async (projTextId) => {
    let result = true;

    try {
      const text = await models.ProjectText.findOne({
        where: {
          proj_text_id: projTextId,
        },
        attributes: { exclude: ["id"] },
      });

      if (text) {
        await models.ProjectText.destroy({
          where: {
            proj_text_id: projTextId,
          },
        });
        console.log("Texto eliminado con éxito:", text);
      } else {
        console.warn("El texto no se encontró con el ID:", projTextId);
        result = false;
      }
    } catch (error) {
      console.error("Error al eliminar la imagen:", error);
      result = false;
    }

    return result;
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

  static addImageToProjectCreate = async (body) => {
    const result = true;
    try {
      const image = await models.sequelize.query(
        queries.addImageToProjectCreate,
        {
          replacements: {
            project_id: body.project_id,
            path: body.path,
          },
        }
      );

      if (image) {
        result = true;
      } else {
        result = false;
      }
    } catch (error) {}
    return result;
  };

  static updateImageOrder = async (projectId, body) => {
    let result = true;

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
      const text = await models.ProjectText.findOne({
        where: {
          proj_text_id: body.proj_text_id,
          project_id: projectId,
          index: body.previousIndex,
        },
        attributes: { exclude: ["id"] },
      });

      if (text) {
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

module.exports = Project;
