'use strict';

const userRoleFactory = require('../api/auth/userRole.factory')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const userRole = await userRoleFactory(3)
    await queryInterface.bulkInsert('user_role', userRole,{})
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('user_role', null,{})
  }
};
