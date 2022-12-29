const GenericController = require('./Generic.Controller');

class CategoryTypeController extends GenericController {
  constructor() {
    super('CategoryType');
  }
}

module.exports = new CategoryTypeController();