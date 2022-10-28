const GenericController = require('./Generic.Controller');

class ProductController extends GenericController {
  constructor() {
    super('Product');
  }
};

module.exports = new ProductController();