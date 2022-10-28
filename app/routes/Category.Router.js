const GenericRouter = require('./Generic.Router');
const CategoryController = require('../controllers/Category.Controller');

class CategoryRouter extends GenericRouter {
  constructor() {
    const controller = new CategoryController();
    super(controller);
    this.controller = controller;
  }
}

module.exports = CategoryRouter;