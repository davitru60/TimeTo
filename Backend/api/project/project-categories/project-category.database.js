const models = require("../../../models");

class ProjectCategory {
  static getProjectCategories = async (projectId) => {
    try {
      const projectCategories = await models.ProjectCategory.findAll({
        where: {
          project_id: projectId,
        },
      });

      return projectCategories;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  static getProjectsCategories = async () => {
    try {
      const projectCategories = await models.ProjectCategory.findAll();

      return projectCategories;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  static addProjectCategory = async (body) => {
    try {
      const newProjectCategory = await models.ProjectCategory.create({
        project_id: body.project_id,
        category_id: body.category_id,
      });

      return newProjectCategory;
    } catch (error) {
      console.error("Error adding project category:", error);
      throw new Error("Failed to add project category");
    }
  };

  static deleteProjectCategory = async (projCatId) => {
    try {
      let result = false;

      try {
        const category = await models.ProjectCategory.findByPk(projCatId);

        if (category) {
          result = true;
          await category.destroy();
        } else {
          result = false;
        }
      } catch (error) {}

      return result;
    } catch (error) {}
  };
}

module.exports = ProjectCategory;
