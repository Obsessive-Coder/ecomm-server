const GenericRouter = require('./Generic.Router');
const metricController = require('../controllers/Metric.Controller');

class MetricRouter extends GenericRouter {
  constructor() {
    super(metricController);
  }
}

module.exports = new MetricRouter().router;