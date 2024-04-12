'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('user_role', {
      user_role_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
  
      role_id:{
        type: Sequelize.INTEGER,
        references:{
          model:{
            tableName: 'roles'
          },
          key: 'role_id'
        }
      },

      user_id:{
        type: Sequelize.INTEGER,
        references:{
          model:{
            tableName: 'users'
          },
          key: 'user_id'
        }
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('user_role');
  }
};