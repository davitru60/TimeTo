'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserInterest extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  UserInterest.init({
    user_int_id: {
      type: DataTypes.INTEGER,
      primaryKey: true 
    },
    user_id: DataTypes.INTEGER,
    category_id: DataTypes.INTEGER
  }, {
    sequelize,
    timestamps:false,
    tableName: 'user_interests',
    modelName: 'UserInterest',
  });
  return UserInterest;
};