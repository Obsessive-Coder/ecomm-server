const db = require('../models');
const GenericController = require('./Generic.Controller');
const { Product } = db;
const Op = db.Sequelize.Op;

function handleError(error) {
  return {
    message:
      error.message || 'An error occurred while accessing the database.'
  }
}

class ProductController extends GenericController {
  constructor() {
    super('Product');
  }
};

module.exports = ProductController;