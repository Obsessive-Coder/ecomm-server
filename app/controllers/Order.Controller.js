const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const db = require('../models');
const GenericController = require('./Generic.Controller');

class OrderController extends GenericController {
  constructor() {
    super('Order');
  }

  getOrderTotal(orderItems = [], shipping = 0) {
    const itemsCost = orderItems.reduce((prev, { item_price, quantity }) => (
      prev + (item_price * quantity)
    ), 0);
    return (itemsCost + shipping).toFixed(2);
  }

  findAll(req, res) {
    const {
      order: { column = 'id', direction = 'ASC' } = {},
      recipient_name
    } = req.query;

    this.TableModel.findAll({
      where: {
        ...(recipient_name ? {
          recipient_name: { [Op.like]: `%${recipient_name}%` }
        } : {})
      },
      include: [{
        model: db.OrderItem,
        attributes: ['id', 'quantity', 'item_price', 'product_id'],
      }, {
        model: db.OrderStatus,
        attributes: ['title', 'description']
      }]
    })
      .then(records => {
        const data = records.map(record => {
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
            total: this.getOrderTotal(OrderItems, shipping),
            items: OrderItems,
          };
        });

        if (column === 'price') {
          data?.sort((a, b) => direction === 'DESC' ? b.total - a.total : a.total - b.total);
        }

        res.send(data);
      })
      .catch(error => res.status(500).send(this.handleError(error)));
  }

  findOne(req, res) {
    const { id } = req.params;

    this.TableModel.findOne({
      where: { id },
      include: [{
        model: db.OrderItem
      }, {
        model: db.OrderStatus,
        attributes: ['title', 'description']
      }]
    })
      .then(record => {
        const {
          id, recipient_name, address, phone, payment, status_id,
          shipping, OrderItems, OrderStatus: { title: status }, updatedAt: date
        } = record;

        res.send({
          id,
          recipient_name,
          address, phone,
          payment,
          status_id,
          date,
          status,
          shipping,
          total: this.getOrderTotal(OrderItems, shipping),
          items: OrderItems
        });
      })
      .catch(error => res.status(500).send(this.handleError(error)));
  }

  destroy(req, res) {
    const { id } = req.params;

    this.TableModel.findByPk(
      id, {
      include: [{
        model: db.OrderItem,
        attributes: ['product_id', 'quantity']
      }]
    })
      .then(({ OrderItems }) => {
        const promises = OrderItems.map(({ product_id, quantity: itemQuantity }) => {
          db.Product.findByPk(product_id, { attributes: ['quantity'] })
            .then(({ quantity: productQuantity }) => productQuantity + itemQuantity)
            .then(quantity => db.Product.update({ quantity }, { where: { id: product_id } }));
        });

        Promise.all(promises)
          .then(() => super.destroy(req, res));
      })
  }
}

module.exports = new OrderController();