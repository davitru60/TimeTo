'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('user_interests', {
      user_int_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id:{
        type: Sequelize.INTEGER,
        references:{
          model:{
            tableName: "users"
          },
          key: "user_id",
          allowNull:false,
        }
      },

      category_id:{
        type: Sequelize.INTEGER,
        references:{
          model:{
            tableName: "categories"
          },
          key: "category_id",
          allowNull:false,
        }
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('UserInterests');
  }
};