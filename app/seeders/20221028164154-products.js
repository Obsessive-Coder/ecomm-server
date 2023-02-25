'use strict';
const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const categories = await queryInterface.sequelize
      .query(
        'SELECT id from categories WHERE active = true;',
        { type: Sequelize.QueryTypes.SELECT }
      );

    const categoryIds = categories.map(({ id }) => id);

    const getRandomCategoryId = () => {
      const index = Math.floor(Math.random() * categoryIds.length);
      return categoryIds[index];
    };

    const products = Array.from(Array(1000).keys()).map(value => ({
      id: uuidv4(),
      title: `Test Product ${value}`,
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      price: Math.floor(Math.random() * 10000),
      category_id: getRandomCategoryId(),
      quantity: Math.floor(Math.random() * 10000),
      image_url: 'https://via.placeholder.com/350x150'
    }));

    await queryInterface.bulkInsert('products', products, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('products', null, {});
  }
};
