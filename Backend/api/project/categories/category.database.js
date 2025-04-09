const models = require("../../../models");
const { Sequelize, QueryTypes } = require("sequelize");

class Category {
  static getCategories = async () => {
    try {
      const categories = await models.Category.findAll();
      return categories;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  static createCategory = async (body) => {
    try {
      const newCategory = await models.Category.create({
        name: body.name,
      });

      return newCategory;
    } catch (error) {
      throw new Error(`Failed to create category: ${error.message}`);
    }
  };

  static updateCategory = async (categoryId, body) => {
    try {
      const category = await models.Category.findByPk(categoryId);

      if (!category) {
        throw new Error("Category not found");
      }

      await category.update(body);

      return category;
    } catch (error) {
      throw new Error(`Failed to update category: ${error.message}`);
    }
  };

  static deleteCategory = async (categoryId) => {
    try {
      const category = await models.Category.findByPk(categoryId);

      if (!category) {
        return {
          success: false,
          msg: "Category not found",
        };
      }

      await category.destroy();
      return {
        success: true,
        msg: "Category deleted successfully",
      };
    } catch (error) {
      if (error.name === "SequelizeForeignKeyConstraintError") {
        return {
          success: false,
          msg: "Category cannot be deleted due to associated foreign key constraints",
        };
      }

      console.error("Error deleting category:", error);
      return {
        success: false,
        msg: "An error occurred while trying to delete the category",
      };
    }
  };
}

module.exports = Category;
