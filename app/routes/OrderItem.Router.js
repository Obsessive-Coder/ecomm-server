const GenericRouter = require('./Generic.Router');
const orderItemController = require('../controllers/OrderItem.Controller');

class OrderItemRouter extends GenericRouter {
  constructor() {
    super(orderItemController);
  }
}

module.exports = new OrderItemRouter().router;