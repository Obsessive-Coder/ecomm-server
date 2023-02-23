'use strict';
const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const products = await queryInterface.sequelize
      .query(
        'SELECT id, price from products WHERE active = true;',
        { type: Sequelize.QueryTypes.SELECT }
      );

    const statuses = await queryInterface.sequelize
      .query(
        'SELECT id from order_statuses;',
        { type: Sequelize.QueryTypes.SELECT }
      );

    const statusIds = statuses.map(({ id }) => id);

    const getRandomStatusId = () => {
      const index = Math.floor(Math.random() * statusIds.length);
      return statusIds[index];
    };

    const getRandomProduct = () => {
      const index = Math.floor(Math.random() * products.length);
      return products[index];
    };

    const getRandomDate = (startDate, endDate) => {
      // Taken from https://stackoverflow.com/a/9035732/11878783.
      return new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()));
    };

    const data = Array.from(Array(30).keys())
      .map(() => {
        const orderDate = getRandomDate(new Date(2020, 0, 1), new Date());

        return ({
          id: uuidv4(),
          recipient_name: 'John Doe',
          address: '123 Abc Avenue',
          phone: '(012) 345-6789',
          payment: ['COD', 'Card'][Math.floor(Math.random() * 2)],
          status_id: getRandomStatusId(),
          createdAt: orderDate,
          updatedAt: orderDate
        })
      });

    await queryInterface.bulkInsert('orders', data, {});

    const orders = await queryInterface.sequelize
      .query(
        'SELECT id from orders;',
        { type: Sequelize.QueryTypes.SELECT }
      );

    const allItems = [];

    for (let i = 0; i < orders.length; i++) {
      const { id: orderId } = orders[i];

      const items = Array.from(Array(Math.ceil(Math.random() * 10)).keys())
        .map(() => {
          const { id: productId, price: productPrice } = getRandomProduct();
          return ({
            id: uuidv4(),
            order_id: orderId,
            product_id: productId,
            item_price: productPrice,
            quantity: Math.ceil(Math.random() * 10)
          });
        });

      allItems.push(...items);
    }

    await queryInterface.bulkInsert('order_items', allItems, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('orders', null, {});
    await queryInterface.bulkDelete('order_items', null, {});
  }
};
