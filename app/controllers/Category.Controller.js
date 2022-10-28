const GenericController = require('./Generic.Controller');

class CategoryController extends GenericController {
  constructor() {
    super('Category');
  }
}

module.exports = CategoryController;