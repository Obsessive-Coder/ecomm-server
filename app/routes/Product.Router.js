const GenericRouter = require('./Generic.Router');
const ProductController = require('../controllers/Product.Controller');

class ProductRouter extends GenericRouter {
  constructor() {
    const controller = new ProductController();
    super(controller);
    this.controller = controller;
  }
}

module.exports = ProductRouter;