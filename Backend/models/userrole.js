'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserRole extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  UserRole.init({
    role_id:DataTypes.INTEGER,
    user_id:DataTypes.INTEGER
  }, {
    sequelize,
    tableName: 'user_role',
    modelName: 'UserRole',
  });
  return UserRole;
};