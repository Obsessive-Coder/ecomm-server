'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Products', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.TEXT
      },
      price: {
        type: Sequelize.NUMERIC(12, 2)
      },
      // category_id: {
      //   type: Sequelize.UUIDV4
      // },
      // inventory_id: {
      //   type: Sequelize.UUIDV4
      // },
      // discount_id: {
      //   type: Sequelize.UUIDV4
      // },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Products');
  }
};