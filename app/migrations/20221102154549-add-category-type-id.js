'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(
      'categories',
      'type_id',
      {
        type: Sequelize.UUID,
        references: {
          model: 'category_types',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      }
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('category_types', 'type_id');
  }
};
