'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Project extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Project.hasOne(models.HomeProjectImage, {
        foreignKey: 'project_id',
        onDelete: 'CASCADE',   
        hooks: true
      });

      Project.hasMany(models.ProjectCategory, {
        foreignKey: 'project_id',
        onDelete: 'CASCADE',
        hooks: true
      })

      Project.hasMany(models.ProjectImage, {
        foreignKey: 'project_id',
        onDelete: 'CASCADE',
        hooks: true
      })

      Project.hasMany(models.ProjectText, {
        foreignKey: 'project_id',
        onDelete: 'CASCADE',
        hooks: true
      })
    }
  }
  Project.init({
    project_id: {
      type: DataTypes.INTEGER,
      primaryKey: true 
    },
    name: DataTypes.STRING,
    description: DataTypes.STRING,
  }, {
    sequelize,
    timestamps:false,
    tableName: 'projects',
    modelName: 'Project',
  });
  return Project;
};