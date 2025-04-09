'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('project_categories', {
      proj_cat_id: {
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
    await queryInterface.dropTable('project_categories');
  }
};