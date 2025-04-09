const models = require("../../../models");
const { Sequelize, QueryTypes } = require("sequelize");
const queries = require("../project.queries");

class ProjectGeneral {
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

  static getUserInterests = async () => {
    try {
      const userInterests = await models.UserInterest.findAll();
      return userInterests;
    } catch (error) {
      console.error(error);
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
    try {
      
      const project = await models.Project.findByPk(projectId);

      await project.update(body);

      return project;
    } catch (error) {
      console.error("Error updating project:", error);
      throw new Error(`Failed to update project: ${error.message}`);
    }
  };

  static deleteProject = async (projectId) => {
    let result = false;
  
    try {
      const project = await models.Project.findByPk(projectId);

      if (project) {
        
        await project.destroy();
        console.log(`Project with ID ${projectId} and related records deleted successfully.`);
        result = true; 
      } else {
        console.error(`Project with ID ${projectId} not found.`);
      }
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  

    return result;
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

  static updateProjectHomeImage = async (body) => {
    try {
      const projectHomeImage = await models.HomeProjectImage.findByPk(
        body.project_id
      );

      if (projectHomeImage) {
        // Si body.path es un array, tomará el primer elemento (body.path[0]).
        const pathToUpdate = Array.isArray(body.path)
          ? body.path[0]
          : body.path;

        await projectHomeImage.update({
          path: pathToUpdate,
        });
      }

      return projectHomeImage;
    } catch (error) {
      throw new Error(`Failed to update image: ${error.message}`);
    }
  };
}

module.exports = ProjectGeneral;
