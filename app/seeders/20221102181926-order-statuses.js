'use strict';
const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const data = [{
      id: uuidv4(),
      title: 'Cancelled',
      description: 'The order has been cancelled.'
    }, {
      id: uuidv4(),
      title: 'Delivered',
      description: 'The order has been delivered.'
    }, {
      id: uuidv4(),
      title: 'Pending',
      description: 'The order is pending.'
    }, {
      id: uuidv4(),
      title: 'Processing',
      description: 'The order is processing.'
    }];

    await queryInterface.bulkInsert('order_statuses', data, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('order_statuses', null, {});
  }
};
