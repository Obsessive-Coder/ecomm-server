const db = require('../models');
const Product = db.Product;
const Op = db.Sequelize.Op;

class ProductController {
  // Create a new product in the database.
  create(req, res) {
    const { title, description, price } = req.body;

    // Validate request    
    if (!title || !description || !price) {
      res.status(400).send({
        message: "Every product must have a title, description, and price."
      });
      return;
    }

    // Create and save the new product.
    const product = { title, description, price };

    Product.create(product)
      .then(product => res.send(product))
      .catch(error => res.status(500).send(this.handleError(error)))
  };

  // Find all products in the database or all by a product title.
  findAll(req, res) {

    const { title } = req.query;
    const whereClause = title ? { title: { [Op.like]: `%${title}` } } : null;

    Product.findAll({ where: whereClause })
      .then(products => res.send(products))
      .catch(error => res.status(500).send({
        message: error.message || 'An error occurred while accessing the database.'
      }));
  };

  // Find a single product in the database using its id.
  findOne(req, res) {
    const { productId } = req.params;

    Product.findByPk(productId)
      .then(product => {
        if (product) {
          res.send(product);
        } else {
          res.status(404).send({
            message: `Cannot find the product with id: ${productId}`
          })
        }
      })
      .catch(error => res.status(500).send(this.handleError(error)))
  };

  // Update a product using its id.
  update(req, res) {
    const { id } = req.params;

    Product.update(req.body, { where: { id } })
      .then(updatedCount => {
        if (updatedCount == 1) {
          res.send({ message: 'Successfully updated the product.' });
        } else {
          res.send({ message: `Cannot update the product with id: ${id}` })
        }
      })
      .catch(error => res.status(500).send(this.handleError(error)));
  }

  // Delete a product using its id.
  delete(req, res) {
    const { id } = req.params;

    Product.destroy({ where: { id } })
      .then(destroyedCount => {
        if (destroyedCount == 1) {
          res.send({ message: 'The product what successfully deleted.' });
        } else {
          res.send({ message: `Cannot delete the product with id:${id}` });
        }
      })
      .catch(error => res.status(500).send(this.handleError(error)));
  }

  // Delete all products from the database.
  deleteAll(req, res) {
    Product.destroy({ where: {}, truncate: false })
      .then(destroyedCount => {
        res.send({ message: `${destroyedCount} products were deleted from the database.` });
      })
      .catch(error => res.status(500).send(this.handleError(error)));
  }

  // Find all discounted products.
  findAllDiscounted(req, res) {
    res.send({ message: 'This feature is not yet implemented.' })

    Product.findAll({ where: { discount_id: !null } })
      .then(products => res.send(products))
      .catch(error => res.status(500).send(this.handleError(error)));
  }

  handleError(error) {
    return {
      message:
        error.message || 'An error occurred while accessing the database.'
    }
  }
};

module.exports = new ProductController();