'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('project_images', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      
      project_id:{
        type: Sequelize.INTEGER,
        references:{
          model:{
            tableName: "projects"
          },
          key: "project_id",
          primaryKey:true,
          allowNull:false,

        }
      },
      path:{
        type: Sequelize.STRING
      }
      
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('project_images');
  }
};