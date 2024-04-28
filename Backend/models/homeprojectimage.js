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
      // define association here
    }
  }
  HomeProjectImage.init({
    project_img_id: DataTypes.INTEGER,
  }, {
    sequelize,
    timestamps:false,
    tableName: 'home_project_imgs',
    modelName: 'HomeProjectImage',
  });
  return HomeProjectImage;
};