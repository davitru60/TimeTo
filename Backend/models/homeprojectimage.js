'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class HomeProjectImage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
       // Relación inversa: HomeProjectImg pertenece a un Proyecto
      HomeProjectImage.belongsTo(models.Project, {
        foreignKey: 'project_id',
      })
    }
  }
  HomeProjectImage.init({
    home_img_id:{
      type: DataTypes.INTEGER,
      primaryKey: true 
    },
    project_id: DataTypes.INTEGER,
    path: DataTypes.STRING,


  }, {
    sequelize,
    timestamps:false,
    tableName: 'home_project_imgs',
    modelName: 'HomeProjectImage',
  });
  return HomeProjectImage;
};