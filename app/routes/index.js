const router = require('express').Router();
const productRoutes = require('./product.routes');

router.use('/api/products', productRoutes);

module.exports = router;