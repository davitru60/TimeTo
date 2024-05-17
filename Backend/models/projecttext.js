'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProjectText extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ProjectText.init({
    proj_text_id: {
      type: DataTypes.INTEGER,
      primaryKey: true 
    },
    project_id: DataTypes.INTEGER,
    f_type_id: DataTypes.INTEGER,
    category: DataTypes.STRING,
    title: DataTypes.STRING,
    text: DataTypes.STRING,
    index: DataTypes.INTEGER
  }, {
    sequelize,
    timestamps:false,
    tableName: 'project_texts',
    modelName: 'ProjectText',
  });
  return ProjectText;
};