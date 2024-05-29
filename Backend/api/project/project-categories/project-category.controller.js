const { StatusCodes } = require("http-status-codes");
const projectCategory = require("./project-category.database");

class ProjectCategoryController {
  static getProjectCategories = async (req, res) => {
    try {
      const projectId = req.params.id;
      const projectCategories = await projectCategory.getProjectCategories(projectId);

      const response = {
        success: true,
        data: {
          projectCategories: projectCategories,
        },
      };

      res.status(StatusCodes.OK).json(response);
    } catch (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: "Error getting categories", detail: error });
    }
  };

  static addProjectCategory = async (req, res) => {
    try {
      const projectCategoryAdd = await projectCategory.addProjectCategory(req.body);

      if (projectCategoryAdd) {
        const response = {
          success: true,
          msg: "Project category has been successfully added",
          data: projectCategoryAdd
        };

        res.status(StatusCodes.OK).json(response);
      } else {
        const response = {
          success: false,
          msg: "Failed to update project category",
        };
        res.status(StatusCodes.BAD_REQUEST).json(response);
      }
    } catch (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: "Error creating project categories", detail: error });
    }
  };

  static deleteProjectCategory = async (req, res) => {
    try {
      const projCatId = req.params.id;
      const categoryDelete = await projectCategory.deleteProjectCategory(projCatId);

      if (categoryDelete) {
        const response = {
          success: true,
          msg: "Category has been successfully deleted",
        };

        res.status(StatusCodes.OK).json(response);
      } else {
        const response = {
          success: false,
          msg: "Failed to delete category",
        };
        res.status(StatusCodes.BAD_REQUEST).json(response);
      }
    } catch (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: "Error deleting category", detail: error });
    }
  };
}

module.exports = ProjectCategoryController;