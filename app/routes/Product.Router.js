const GenericRouter = require('./Generic.Router');
const productController = require('../controllers/Product.Controller');

class ProductRouter extends GenericRouter {
  constructor() {
    super(productController);
  }
}

module.exports = new ProductRouter().router;