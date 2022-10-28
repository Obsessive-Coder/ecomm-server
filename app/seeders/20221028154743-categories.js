'use strict';
const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const data = Array.from(Array(10).keys()).map(value => ({
      id: uuidv4(),
      title: `Test Category ${value}`,
    }));

    await queryInterface.bulkInsert('categories', data, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('categories', null, {});
  }
};
