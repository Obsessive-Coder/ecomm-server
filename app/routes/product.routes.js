const router = require('express').Router();
const ProductController = require('../controllers/product.controller');


router.route('/')
  .get(ProductController.findAll);

router.route('/:productId')
  .get(ProductController.findOne)
  .put(ProductController.update)
  .delete(ProductController.delete);

module.exports = router;
