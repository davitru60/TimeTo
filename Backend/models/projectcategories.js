'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProjectCategories extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ProjectCategories.init({
    proj_cat_id: {
      type: DataTypes.INTEGER,
      primaryKey: true 
    },
    project_id: DataTypes.INTEGER,
    category_id: DataTypes.INTEGER
  }, {
    sequelize,
    timestamps:false,
    tableName: 'project_categories',
    modelName: 'ProjectCategories',
  });
  return ProjectCategories;
};