const router = require('express').Router();
const productController = require('../controllers/product.controller');

router.route('/')
  .get(productController.findAll);

module.exports = router;
