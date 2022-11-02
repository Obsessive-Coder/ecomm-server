'use strict';
const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const data = Array.from(Array(10).keys()).map(value => ({
      id: uuidv4(),
      title: `Test Type ${value}`,
    }));

    await queryInterface.bulkInsert('category_types', data, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('category_types', null, {});
  }
};
