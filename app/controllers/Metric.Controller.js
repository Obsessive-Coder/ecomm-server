const db = require('../models');
const GenericController = require('./Generic.Controller');

class MetricController extends GenericController {
  constructor() {
    super('');

    // Bind class methods.
    this.findAll = this.findAll.bind(this);
  }

  getOrderTotal(orderItems = [], shipping = 0) {
    const itemsCost = orderItems.reduce((prev, { item_price, quantity }) => (
      prev + (item_price * quantity)
    ), 0);
    return (itemsCost + shipping);
  }

  // Route Handlers.
  findAll(req, res) {
    // Today total = total of all processing and delivered orders with today's date.

    // Month total = total of all processing and delivered orders with created date's month same as today's month.

    // All-time total = total of all processing and delivered orders.

    db.Order.findAll({
      include: [{
        model: db.OrderItem,
        attributes: ['id', 'quantity', 'item_price', 'product_id'],
      }, {
        model: db.OrderStatus,
        attributes: ['title', 'description'],
        where: {
          title: ['Delivered', 'Processing']
        }
      }],
    })
      .then(records => {
        const allTime = records
          .reduce((prev, { OrderItems, shipping }) => (
            prev + this.getOrderTotal(OrderItems, shipping)
          ), 0)
          .toFixed(2);

        const today = new Date();
        const day = today.getUTCDay();
        const month = today.getUTCMonth();
        const year = today.getUTCFullYear();

        const todayTotal = records
          .filter(({ updatedAt }) => {
            const date = new Date(updatedAt);
            return date.getUTCFullYear() === year
              && date.getUTCMonth() === month
              && date.getUTCDay() === day;
          })
          .reduce((prev, { OrderItems, shipping }) => (
            prev + this.getOrderTotal(OrderItems, shipping)
          ), 0)
          .toFixed(2);

        const monthTotal = records
          .filter(({ updatedAt }) => {
            const date = new Date(updatedAt);
            return date.getUTCFullYear() === year && date.getUTCMonth() === month;
          })
          .reduce((prev, { OrderItems, shipping }) => (
            prev + this.getOrderTotal(OrderItems, shipping)
          ), 0)
          .toFixed(2);

        return {
          today: todayTotal,
          month: monthTotal,
          total: allTime
        }
      })
      .then(totals => {
        db.Order.findAll({
          include: [{
            model: db.OrderItem,
            attributes: ['id', 'quantity', 'item_price', 'product_id'],
          }, {
            model: db.OrderStatus,
            attributes: ['title', 'description'],
            where: {
              title: ['Delivered', 'Pending', 'Processing']
            }
          }],
        })
          .then(records => {
            const orders = records
              .filter(({ OrderStatus: { title } }) => (
                ['Pending', 'Processing', 'Delivered'].includes(title)
              ))
              .map(record => {
                const {
                  id, recipient_name, address, phone, payment, status_id,
                  shipping, OrderItems, OrderStatus: { title: status }, updatedAt: date
                } = record;

                return {
                  id,
                  recipient_name,
                  address, phone,
                  payment,
                  status_id,
                  date,
                  status,
                  shipping,
                  total: this.getOrderTotal(OrderItems, shipping).toFixed(2),
                  items: OrderItems,
                };
              });

            res.send({
              orders,
              totals
            });
          });
      })
      .catch(error => res.status(500).send(this.handleError(error)));
  }

  handleError(error) {
    return {
      message:
        error.message || 'An error occurred while accessing the database.'
    }
  }
}

module.exports = new MetricController();