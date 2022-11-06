'use strict';
const { v4: uuidv4 } = require('uuid');
const db = require('../models');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const products = await db.Product.findAll();
    const statuses = await db.OrderStatus.findAll();
    const statusIds = statuses.map(({ id }) => id);

    const getRandomStatusId = () => {
      const index = Math.floor(Math.random() * statusIds.length);
      return statusIds[index];
    };

    const getRandomProduct = () => {
      const index = Math.floor(Math.random() * products.length);
      return products[index];
    };

    const data = Array.from(Array(1000).keys())
      .map(() => ({
        id: uuidv4(),
        address: '123 Abc Avenue',
        phone: '(012) 345-6789',
        payment: ['COD', 'Card'][Math.floor(Math.random() * 2)],
        status_id: getRandomStatusId(),
      }));

    await queryInterface.bulkInsert('orders', data, {});

    const orders = await db.Order.findAll();

    const allItems = [];

    for (let i = 0; i < orders.length; i++) {
      const order = orders[i];

      const items = Array.from(Array(Math.ceil(Math.random() * 10)).keys())
        .map(() => {
          const product = getRandomProduct();
          return ({
            id: uuidv4(),
            order_id: order.id,
            product_id: product.id,
            item_price: product.price,
            quantity: Math.ceil(Math.random() * 10)
          });
        });

      allItems.push(...items);
    }

    await queryInterface.bulkInsert('order_items', allItems, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('orders', null, {});
  }
};
