const router = require('express').Router();
const productController = require('../controllers/product.controller');

router.route('/')
  .get(productController.findAll);

router.route('/:productId')
  .get(productController.findOne);

module.exports = router;
