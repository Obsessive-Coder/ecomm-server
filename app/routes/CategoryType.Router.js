const GenericRouter = require('./Generic.Router');
const categoryTypeController = require('../controllers/CategoryType.Controller');

class CategoryTypeRouter extends GenericRouter {
  constructor() {
    super(categoryTypeController);
  }
}

module.exports = new CategoryTypeRouter().router;