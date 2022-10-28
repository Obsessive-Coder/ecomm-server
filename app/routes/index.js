const router = require('express').Router();
const productRoutes = require('./product.routes');
const CategoryRouter = require('./Category.Router');

router.use('/api/products', productRoutes);
router.use('/api/categories', new CategoryRouter().router);

module.exports = router;