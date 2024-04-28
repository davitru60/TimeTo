'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class FormTypes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  FormTypes.init({
    type: DataTypes.STRING
  }, {
    sequelize,
    timestamps:false,
    tableName: 'form_types',
    modelName: 'FormType',
  });
  return FormTypes;
};