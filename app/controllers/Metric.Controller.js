const db = require('../models');
const GenericController = require('./Generic.Controller');

class MetricController extends GenericController {
  constructor() {
    super('');

    // Bind class methods.
    this.getOrderTotal = this.getOrderTotal.bind(this);
    this.reduceOrder = this.reduceOrder.bind(this);
    this.sortByDate = this.sortByDate.bind(this);
    this.findAll = this.findAll.bind(this);
  }

  getOrderTotal(orderItems = [], shipping = 0) {
    const itemsCost = orderItems.reduce((prev, { item_price, quantity }) => (
      prev + (item_price * quantity)
    ), 0);
    return (itemsCost + shipping);
  }

  reduceOrder(prev, { OrderItems, shipping }) {
    return prev + this.getOrderTotal(OrderItems, shipping);
  }

  sortByDate({ date: dateA }, { date: dateB }) {
    return dateB - dateA;
  }

  // Route Handlers.
  findAll(req, res) {
    // Today total = total of all processing and delivered orders with today's date.

    // Month total = total of all processing and delivered orders with created date's month same as today's month.

    // All-time total = total of all processing and delivered orders.

    db.Order.findAndCountAll({
      distinct: true,
      include: [{
        model: db.OrderItem,
        attributes: ['id', 'quantity', 'item_price', 'product_id'],
      }, {
        model: db.OrderStatus,
        attributes: ['title', 'description'],
        where: {
          title: ['Delivered', 'Pending', 'Processing']
        }
      }]
    })
      .then(records => {
        const { count, rows } = records;
        const totalsOrders = rows.filter(({ OrderStatus: { title } }) => title !== 'Pending');

        const today = new Date();
        const day = today.getUTCDay();
        const month = today.getUTCMonth();
        const year = today.getUTCFullYear();

        const allTimeTotal = totalsOrders
          .reduce(this.reduceOrder, 0)
          .toFixed(2);

        const todayTotal = totalsOrders
          .filter(({ updatedAt }) => {
            const date = new Date(updatedAt);
            return date.getUTCFullYear() === year
              && date.getUTCMonth() === month
              && date.getUTCDay() === day;
          })
          .reduce(this.reduceOrder, 0)
          .toFixed(2);

        const monthTotal = totalsOrders
          .filter(({ updatedAt }) => {
            const date = new Date(updatedAt);
            return date.getUTCFullYear() === year && date.getUTCMonth() === month;
          })
          .reduce(this.reduceOrder, 0)
          .toFixed(2);


        const orders = rows.map(record => {
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

        const pending = orders
          .filter(({ status }) => status === 'Pending')
          .sort(this.sortByDate);

        const processing = orders
          .filter(({ status }) => status === 'Processing')
          .sort(this.sortByDate);

        const delivered = orders
          .filter(({ status }) => status === 'Delivered')
          .sort(this.sortByDate);

        const ordersData = {
          orders: {
            count,
            orders: orders.sort(this.sortByDate).slice(0, 5)
          },
          pending: {
            count: pending.length,
            orders: pending.slice(0, 5),
          },
          processing: {
            count: processing.length,
            orders: processing.slice(0, 5),
          },
          delivered: {
            count: delivered.length,
            orders: delivered.slice(0, 5),
          }
        };

        const totals = {
          today: todayTotal,
          month: monthTotal,
          total: allTimeTotal
        };

        res.send({ ordersData, totals });
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