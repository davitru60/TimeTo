const models = require("../../models");
const { Sequelize } = require("sequelize");

class Project {
  static getAllProjects = async () => {
    try {
      const projects = await models.sequelize.query(
        `SELECT p.project_id, p.name, p.description, pi.path FROM projects p 
                JOIN project_images pi 
                ON pi.project_id = p.project_id;`,
        { type: Sequelize.QueryTypes.SELECT }
      );
      return projects;
    } catch (error) {
      throw error;
    }
  };

  static getProjectImages = async (projectId) => {
    try {
      const imagePaths = await models.ProjectImage.findAll({
        where: {
          project_id: projectId,
        },
      });
      return imagePaths;
    } catch (error) {
      throw error;
    }
  };
}

module.exports = Project;
