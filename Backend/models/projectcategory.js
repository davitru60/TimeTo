'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProjectCategory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ProjectCategory.belongsTo(models.Project, {
        foreignKey: 'project_id',
      })
    }
  }
  ProjectCategory.init({
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
    modelName: 'ProjectCategory',
  });
  return ProjectCategory;
};