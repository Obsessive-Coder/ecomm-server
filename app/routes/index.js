const router = require('express').Router();
const categoryRouter = require('./Category.Router');
const categoryTypeRouter = require('./CategoryType.Router');
const orderRouter = require('./Order.Router');
const orderItemRouter = require('./OrderItem.Router');
const orderStatusRouter = require('./OrderStatus.Router');
const productRouter = require('./Product.Router');
const fileRouter = require('./File.Router');
const metricRouter = require('./Metric.Router');

router.use('/api/categories', categoryRouter);
router.use('/api/category-types', categoryTypeRouter);
router.use('/api/orders', orderRouter);
router.use('/api/order-items', orderItemRouter);
router.use('/api/order-statuses', orderStatusRouter);
router.use('/api/products', productRouter);
router.use('/api/files', fileRouter);
router.use('/api/metrics', metricRouter);

module.exports = router;