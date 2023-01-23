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
      .then((orderItem) => {
        if (orderItem) {
          const { quantity: previousQuantity } = orderItem;
          return newQuantity - previousQuantity
        } else {
          return 0;
        }
      })
      .then(quantityDifference => {
        db.Product.findByPk(product_id, { attributes: ['quantity'] })
          .then(({ quantity: productQuantity }) => productQuantity - quantityDifference)
          .then(quantity => db.Product.update({ quantity }, { where: { id: product_id } }))
          .then(() => db.OrderItem.update(req.body, { where: { id } }))
          .then(updatedCount => {
            if (updatedCount == 1) {
              res.send({ message: `Successfully updated the record in ${this.modelName}.` });
            } else {
              res.send(this.handleError({ message: `Could not update the record in ${this.modelName}.` }))
            }
          })
          .catch(error => res.status(500).send(this.handleError(error)));
      })
  }

  destroy(req, res) {
    const { id } = req.params;

    // Get order item quantity.
    // Get product quantity.
    // Update product quantity.

    db.OrderItem.findByPk(id, { attributes: ['product_id', 'quantity'] })
      .then(({ product_id, quantity: itemQuantity }) => {
        db.Product.findByPk(product_id, { attributes: ['quantity'] })
          .then(({ quantity: productQuantity }) => productQuantity += itemQuantity)
          .then(quantity => db.Product.update({ quantity }, { where: { id: product_id } }))
          .then(() => super.destroy(req, res));
      })
  }
}

module.exports = new OrderItemController();