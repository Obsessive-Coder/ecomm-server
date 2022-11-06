const GenericRouter = require('./Generic.Router');
const orderStatusController = require('../controllers/OrderStatus.Controller');

class OrderStatusRouter extends GenericRouter {
  constructor() {
    super(orderStatusController);
  }
}

module.exports = new OrderStatusRouter().router;