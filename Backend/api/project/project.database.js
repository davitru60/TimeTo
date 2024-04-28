const models = require("../../models");
const { Sequelize } = require("sequelize");

class Project {
  static getAllProjects = async () => {
    try {
      const projects = await models.sequelize.query(
        `SELECT p.project_id, p.name, p.description, pi.path FROM projects p 
        JOIN project_images pi 
        ON pi.project_id = p.project_id
        JOIN home_project_imgs hpi
        ON pi.proj_img_id = hpi.project_img_id`,
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
        attributes: { exclude: ['id'] },
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

  static getProjectTexts  = async (projectId) => {
    try{
      const texts = await models.ProjectText.findAll({
        where:{
          project_id : projectId
        },
        attributes:{exclude: ['id']}
      })

      return texts
    }catch(error){
      console.error("Error getting project texts", error);
      throw error;
    }
  }


 

}



module.exports = Project;
