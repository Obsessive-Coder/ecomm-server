const router = require('express').Router();
const categoryRouter = require('./Category.Router');
const productRouter = require('./Product.Router');

router.use('/api/categories', categoryRouter);
router.use('/api/products', productRouter);

module.exports = router;