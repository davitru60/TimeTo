'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProjectImage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ProjectImage.init({
    project_id: DataTypes.INTEGER,
    path: DataTypes.STRING
  }, {
    sequelize,
    timestamps:false,
    tableName: 'project_images',
    modelName: 'ProjectImage',
  });
  return ProjectImage;
};