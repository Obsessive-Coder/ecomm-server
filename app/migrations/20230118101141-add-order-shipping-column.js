'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(
      'orders',
      'shipping',
      {
        type: Sequelize.NUMERIC(12, 2),
        allowNull: false,
        defaultValue: 0.00
      }
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('orders', 'shipping');
  }
};
