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
}


module.exports = ProjectGeneral;
