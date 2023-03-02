const db = require('../models');
const GenericController = require('./Generic.Controller');
const MetricsHelper = require('../utils/helpers/metrics');

const { formatOrders, getCounts, getOrders, getSales, getTotals, getYears } = MetricsHelper;

class MetricController extends GenericController {
  constructor() {
    super('');

    // Bind class methods.
    this.findAll = this.findAll.bind(this);
  }

  // Route Handlers.
  findAll(req, res) {
    const { year = new Date().getUTCFullYear() } = req.query;

    db.Order.findAndCountAll({
      distinct: true,
      include: [{
        model: db.OrderItem,
        attributes: ['id', 'quantity', 'item_price', 'product_id'],
      }, {
        model: db.OrderStatus,
        attributes: ['title', 'description'],
        where: {
          title: ['Delivered', 'Pending', 'Processing']
        }
      }]
    })
      .then(records => {
        const { count, rows } = records;
        const formattedOrders = formatOrders(rows);
        const totals = getTotals(rows.filter(({ OrderStatus: { title } }) => title !== 'Pending'));
        const counts = getCounts(formattedOrders, count);

        const chartsData = {
          years: getYears(formattedOrders).sort((a, b) => b - a),
          tabData: {
            sales: getSales(formattedOrders, year),
            orders: getOrders(formattedOrders, year)
          }
        };

        res.send({ chartsData, counts, totals });
      })
      .catch(error => res.status(500).send(this.handleError(error)));
  }

  handleError(error) {
    return {
      message:
        error.message || 'An error occurred while accessing the database.'
    }
  }
}

module.exports = new MetricController();