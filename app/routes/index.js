const router = require('express').Router();
const ProductRouter = require('./Product.Router');
const CategoryRouter = require('./Category.Router');

router.use('/api/products', new ProductRouter().router);
router.use('/api/categories', new CategoryRouter().router);

module.exports = router;