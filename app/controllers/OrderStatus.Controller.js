const GenericController = require('./Generic.Controller');

class OrderStatusController extends GenericController {
  constructor() {
    super('OrderStatus');
  }
}

module.exports = new OrderStatusController();