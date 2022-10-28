const GenericRouter = require('./Generic.Router');
const categoryController = require('../controllers/Category.Controller');

class CategoryRouter extends GenericRouter {
  constructor() {
    super(categoryController);
  }
}

module.exports = new CategoryRouter().router;