'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(models.UserRole,{as:'UserRole',foreignKey:'user_id'})
    }
  }
  User.init({
    user_id:DataTypes.INTEGER,
    name: DataTypes.STRING,
    first_surname: DataTypes.STRING,
    second_surname: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING
  }, {
    sequelize,
    timestamps: false,
    tableName: 'users',
    modelName: 'User',
  });
  return User;
};