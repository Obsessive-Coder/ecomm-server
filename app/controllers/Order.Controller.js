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

  getPagingData(data, page, limit) {
    const { count: itemCount, rows } = data;
    const pageIndex = page ? +page : 0;
    const pageCount = Math.ceil(itemCount / limit);

    return { itemCount, pageCount, pageIndex, rows };
  };

  findAll(req, res) {
    const {
      order: { column = 'id', direction = 'ASC' } = {},
      recipient_name,
      status_id,
      page = '0',
      limit = '25'
    } = req.query;

    const pageInt = parseInt(page);
    const limitInt = parseInt(limit);
    const offset = pageInt * limitInt;

    this.TableModel.findAndCountAll({
      where: {
        ...(status_id ? { status_id } : {}),
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
      }],
      order: [[column, direction]],
      distinct: true,
      limit: limitInt,
      offset
    })
      .then(records => {
        const data = this.getPagingData(records, pageInt, limitInt);

        const rows = data.rows
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
              total: this.getOrderTotal(OrderItems, shipping),
              items: OrderItems,
            };
          });

        if (column === 'price') {
          rows?.sort((a, b) => direction === 'DESC' ? b.total - a.total : a.total - b.total);
        }

        res.send({ ...data, rows });
      })
      .catch(error => res.status(500).send(this.handleError(error)));
  }

  findOne(req, res) {
    const { id } = req.params;

    this.TableModel.findOne({
      where: { id },
      include: [{
        model: db.OrderItem,
        attributes: ['id', 'quantity', 'item_price', 'product_id'],
        include: [{
          model: db.Product,
          attributes: ['title']
        }]
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