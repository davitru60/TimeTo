const { StatusCodes } = require("http-status-codes");
const category = require("./category.database");

class CategoryController {
  static getCategories = async (req, res) => {
    try {
      const categories = await category.getCategories();

      const response = {
        success: true,
        data: {
          categories: categories,
        },
      };
      res.status(StatusCodes.OK).json(response);
    } catch (error) {
      throw new Error("Error getting categories");
    }
  };

  static createCategory = async (req, res) => {
    try {
      const categoryCreate = await category.createCategory(req.body);

      if (categoryCreate) {
        const response = {
          success: true,
          msg: "Project has been successfully created",
          data: categoryCreate,
        };

        res.status(StatusCodes.OK).json(response);
      } else {
        const response = {
          success: false,
          msg: "Failed to create project",
        };
        res.status(StatusCodes.BAD_REQUEST).json(response);
      }
    } catch (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: "Error adding category", detail: error });
    }
  };

  static updateCategory = async (req, res) => {
    try {
      const categoryId = req.params.id;
      const categoryUpdate = await category.updateCategory(
        categoryId,
        req.body
      );

      if (categoryUpdate) {
        const response = {
          success: true,
          msg: "Category has been successfully updated",
          data: categoryUpdate,
        };
        res.status(StatusCodes.OK).json(response);
      } else {
        const response = {
          success: false,
          msg: "Failed to update category",
        };
        res.status(StatusCodes.BAD_REQUEST).json(response);
      }
    } catch (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: "Error upadting category", detail: error });
    }
  };

  static deleteCategory = async (req, res) => {
    try {
      const categoryId = req.params.id;

      // Llama a la función de servicio para eliminar la categoría
      const result = await category.deleteCategory(categoryId);

      if (result.success) {
        const response = {
          success: true,
          msg: result.msg,
        };
        return res.status(StatusCodes.OK).json(response);
      }
      
      const response = {
        success: false,
        msg: result.msg,
      };
      return res.status(StatusCodes.BAD_REQUEST).json(response);
    } catch (error) {
      console.log("Error deleting category:", error);

      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        msg: "An internal error occurred while trying to delete the category",
        detail: error.message,
      });
    }
  };
}

module.exports = CategoryController;
