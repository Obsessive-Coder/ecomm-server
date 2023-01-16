const GenericController = require('./Generic.Controller');
const db = require('../models');

class OrderItemController extends GenericController {
  constructor() {
    super('OrderItem');
  }

  create(req, res) {
    super.create(req, res);

    const { product_id, quantity: itemQuantity } = req.body;

    db.Product.findByPk(product_id, { attributes: ['quantity'] })
      .then(({ quantity: productQuantity }) => productQuantity - itemQuantity)
      .then(quantity => db.Product.update({ quantity }, { where: { id: product_id } }))
  }

  update(req, res) {
    const { id, product_id, quantity: newQuantity } = req.body;

    db.OrderItem.findByPk(id, { attributes: ['quantity'] })
      .then(({ quantity: previousQuantity }) => newQuantity - previousQuantity)
      .then(quantityDifference => {
        db.Product.findByPk(product_id, { attributes: ['quantity'] })
          .then(({ quantity: productQuantity }) => productQuantity - quantityDifference)
          .then(quantity => db.Product.update({ quantity }, { where: { id: product_id } }))
          .then(() => super.update(req, res));
      })
  }
}

module.exports = new OrderItemController();