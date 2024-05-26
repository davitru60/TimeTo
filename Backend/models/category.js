'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Category.init({
    category_id: {
      type: DataTypes.INTEGER,
      primaryKey: true 
    },

    name: DataTypes.STRING

  }, {
    sequelize,
    timestamps:false,
    tableName: 'categories',
    modelName: 'Category',
  });
  return Category;
};