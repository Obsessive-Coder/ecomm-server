'use strict';
const { v4: uuidv4 } = require('uuid');
const db = require('../models');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const categoryTypes = await db.CategoryType.findAll({ where: { active: true } });

    const typeIds = categoryTypes.map(({ id }) => id);

    const getRandomTypeId = () => {
      const index = Math.floor(Math.random() * typeIds.length);
      return typeIds[index];
    };

    const data = Array.from(Array(10).keys()).map(value => ({
      id: uuidv4(),
      title: `Test Category ${value}`,
      type_id: getRandomTypeId()
    }));

    await queryInterface.bulkInsert('categories', data, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('categories', null, {});
  }
};
