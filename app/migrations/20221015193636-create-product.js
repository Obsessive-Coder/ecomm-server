'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Products', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
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
      //   type: Sequelize.UUID,
      //   allowNull: false,
      //   references: {
      //     table: 'categories',
      //     field: 'id'
      //   },
      // },
      // inventory_id: {
      //   type: Sequelize.UUIDV4
      // },
      // discount_id: {
      //   type: Sequelize.UUIDV4
      // },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now')
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Products');
  }
};
