module.exports = class MetricsHelper {
  static formatOrders(orders = []) {
    const { getOrderTotal } = MetricsHelper;
    return orders.map(record => {
      const {
        id, recipient_name, address, phone, payment, status_id,
        shipping, OrderItems, OrderStatus: { title: status }, updatedAt: date
      } = record;

      return {
        id,
        recipient_name,
        address, phone,
        payment,
        status_id,
        date,
        status,
        shipping,
        total: getOrderTotal(OrderItems, shipping).toFixed(2),
        items: OrderItems,
      };
    });
  }

  static getOrderTotal(orderItems = [], shipping = 0) {
    const itemsCost = orderItems.reduce((prev, { item_price, quantity }) => (
      prev + (item_price * quantity)
    ), 0);
    return (itemsCost + shipping);
  }

  static getOrdersByType(orders = [], type) {
    if (!type) return orders;

    return orders
      .filter(({ status }) => status === type)
      .sort(MetricsHelper.sortByDate);
  }

  static getSalesGraphData(orders = [], year) {
    const { getOrderTotal } = MetricsHelper;

    return orders.reduce((prev, { date, items, shipping }) => {
      if (date.getUTCFullYear() === new Date(year).getUTCFullYear()) {
        const month = date.getUTCMonth();
        const orderTotal = getOrderTotal(items, shipping);

        if (prev[month] === undefined || prev[month] === null) {
          prev[month] = orderTotal;
        } else {
          prev[month] += orderTotal;
        }
      }

      return prev;
    }, []);
  }

  static getYears(orders = []) {
    return orders.reduce((prev, { date }) => {
      const year = date.getUTCFullYear();

      if (!prev.includes(year)) {
        prev.push(year);
      }

      return prev;
    }, []);
  }

  static reduceOrder(prev, { OrderItems, shipping }) {
    return prev + MetricsHelper.getOrderTotal(OrderItems, shipping);
  }

  static sortByDate({ date: dateA }, { date: dateB }) {
    return dateB - dateA;
  }

  static getTotals(orders = []) {
    const { reduceOrder } = MetricsHelper;
    const today = new Date();
    const day = today.getUTCDay();
    const month = today.getUTCMonth();
    const year = today.getUTCFullYear();

    const allTimeTotal = orders
      .reduce(reduceOrder, 0)
      .toFixed(2);

    const todayTotal = orders
      .filter(({ updatedAt }) => {
        const date = new Date(updatedAt);
        return date.getUTCFullYear() === year
          && date.getUTCMonth() === month
          && date.getUTCDay() === day;
      })
      .reduce(reduceOrder, 0)
      .toFixed(2);

    const monthTotal = orders
      .filter(({ updatedAt }) => {
        const date = new Date(updatedAt);
        return date.getUTCFullYear() === year && date.getUTCMonth() === month;
      })
      .reduce(reduceOrder, 0)
      .toFixed(2);

    return {
      today: todayTotal,
      month: monthTotal,
      total: allTimeTotal
    };
  }

  static getCounts(orders = [], count = 0) {
    const { getOrdersByType, sortByDate } = MetricsHelper;

    const pending = getOrdersByType(orders, 'Pending');
    const processing = getOrdersByType(orders, 'Processing');
    const delivered = getOrdersByType(orders, 'Delivered');

    return {
      orders: {
        count,
        orders: orders.sort(sortByDate).slice(0, 5)
      },
      pending: {
        count: pending.length,
        orders: pending.slice(0, 5),
      },
      processing: {
        count: processing.length,
        orders: processing.slice(0, 5),
      },
      delivered: {
        count: delivered.length,
        orders: delivered.slice(0, 5),
      }
    };
  }

  static getSales(orders = [], year) {
    const { getOrdersByType, getSalesGraphData, getYears } = MetricsHelper;

    const pendingOrders = getOrdersByType(orders, 'Pending');
    const processingOrders = getOrdersByType(orders, 'Processing');
    const deliveredOrders = getOrdersByType(orders, 'Delivered');

    const data = {
      years: getYears(orders).sort((a, b) => b - a),
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [{
        label: 'pending',
        data: getSalesGraphData(pendingOrders, year),
        backgroundColor: 'rgb(238, 95, 91)'
      }, {
        label: 'processing',
        data: getSalesGraphData(processingOrders, year),
        backgroundColor: 'rgb(91, 192, 222)'
      }, {
        label: 'delivered',
        data: getSalesGraphData(deliveredOrders, year),
        backgroundColor: 'rgb(248, 148, 6)'
      }]
    };

    return data;
  }
}