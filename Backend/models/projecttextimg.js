'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProjectTextImg extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ProjectTextImg.init({
    project_id: DataTypes.INTEGER,
    f_type_id: DataTypes.INTEGER,
    text: DataTypes.STRING,
    index: DataTypes.INTEGER
  }, {
    sequelize,
    timestamps: false,
    tableName: 'project_text_imgs',
    modelName: 'ProjectTextImg',
  });
  return ProjectTextImg;
};