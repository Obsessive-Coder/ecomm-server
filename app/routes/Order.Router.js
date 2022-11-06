const GenericRouter = require('./Generic.Router');
const orderController = require('../controllers/Order.Controller');

class OrderRouter extends GenericRouter {
  constructor() {
    super(orderController);
  }
}

module.exports = new OrderRouter().router;