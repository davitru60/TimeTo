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
        throw new Error('Category not found');
      }
  
      await category.update(body);
  
      return category;
    } catch (error) {
      throw new Error(`Failed to update category: ${error.message}`);
    }
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
