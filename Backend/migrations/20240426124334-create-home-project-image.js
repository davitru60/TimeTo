'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('home_project_imgs', {
      home_img_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },

      project_img_id:{
        type: Sequelize.INTEGER,
        references:{
          model:{
            tableName: "project_images"
          },
          key: "proj_img_id",
          primaryKey:true,
          allowNull:false,

        }
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

    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('home_project_imgs');
  }
};