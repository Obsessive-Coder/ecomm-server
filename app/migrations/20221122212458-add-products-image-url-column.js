'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(
      'products',
      'image_url',
      {
        type: Sequelize.STRING(2083),
        allowNull: false
      }
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('products', 'image_url');
  }
};
