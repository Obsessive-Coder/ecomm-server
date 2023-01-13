const GenericController = require('./Generic.Controller');

class OrderItemController extends GenericController {
  constructor() {
    super('OrderItem');
  }
}

module.exports = new OrderItemController();