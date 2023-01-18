const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const db = require('../models');
const GenericController = require('./Generic.Controller');

class OrderController extends GenericController {
  constructor() {
    super('Order');
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
        attributes: ['id', 'quantity', 'item_price'],
        include: [{
          model: db.Product,
          attributes: ['id', 'title', 'quantity']
        }]
      }, {
        model: db.OrderStatus,
        attributes: ['title', 'description']
      }]
    })
      .then(records => {
        const data = records.map(record => {
          const {
            id, recipient_name, updatedAt, address, phone, payment, status_id,
            OrderItems, OrderStatus,
          } = record;

          return {
            id,
            date: updatedAt,
            recipient_name,
            address,
            phone,
            payment,
            status_id,
            total: OrderItems.reduce((prev, { item_price, quantity }) => prev + (item_price * quantity), 0),
            status: OrderStatus.title,
            items: OrderItems.map((item) => ({
              ...item.dataValues,
              title: item.Product.title
            })),
          };
        });

        if (column === 'price') {
          if (direction === 'DESC') {
            data?.sort((a, b) => (a.total > b.total ? -1 : 1))
          } else {
            data?.sort((a, b) => (a.total > b.total ? 1 : -1))
          }
        }

        res.send(data)
      })
      .catch(error => res.status(500).send(this.handleError(error)));
  }

  findOne(req, res) {
    const { id } = req.params;

    this.TableModel.findOne({
      where: { id },
      include: [{
        model: db.OrderItem,
        include: [{
          model: db.Product,
          attributes: ['id', 'title', 'quantity']
        }]
      }, {
        model: db.OrderStatus,
        attributes: ['title', 'description']
      }]
    })
      .then(record => {
        const {
          id, updatedAt, recipient_name, address, phone, payment, status_id, OrderItems, OrderStatus
        } = record;

        res.send({
          id,
          date: updatedAt,
          recipient_name,
          address,
          phone,
          payment,
          status_id,
          orderItems: OrderItems.map((item) => ({
            ...item.dataValues,
            title: item.Product.title
          })),
          total: OrderItems.reduce((prev, { item_price, quantity }) => prev + (item_price * quantity), 0),
          status: OrderStatus.title
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