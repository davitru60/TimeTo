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
    let result = false;
    try {
  
      const newCategory = await models.Category.create({
        name: body.name,
      });

      if (newCategory) {
        result = true;
      }
    } catch (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: "Error adding category", detail: error });
    }

    return result;
  };

  
  static updateCategory = async (categoryId, body) => {
    let result = false;
    try {
      const category = await models.Category.findByPk(categoryId);

      if (category) {
        result = true;
        await category.update(body);
      } else {
        result = false;
      }
    } catch (error) {}

    return result;
  };

  static deleteCategory = async (categoryId) => {
    let result = false;

    try {
      const category = await models.Category.findByPk(categoryId);

      if (category) {
        result = true;
        await category.destroy();
      } else {
        result = false;
      }
    } catch (error) {}

    return result;
  };
}

module.exports = Category;
