const { differenceInHours, isThisMonth, isThisYear } = require('date-fns');

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

  static isWithinSalesPeriod(date, salesPeriod = 'week') {
    let isWithinPeriod = false;
    switch (salesPeriod) {
      case 'week':
        isWithinPeriod = (Math
          .floor(differenceInHours(new Date(), new Date(date)) / (7 * 24)) | 0) === 0;
        break;

      case 'month':
        isWithinPeriod = isThisMonth(new Date(date));
        break;

      case 'year':
        isWithinPeriod = isThisYear(new Date(date))
        break;

      default:
        break;
    }

    return isWithinPeriod;
  }

  static getSalesGraphData(orders = [], salesPeriod = 'week') {
    const { isWithinSalesPeriod, getOrderTotal, getTimestamp } = MetricsHelper;

    return orders.reduce((prev, { date, items, shipping }) => {
      const timestamp = getTimestamp(date);
      const restPrev = prev.filter(({ x }) => x !== timestamp);
      const next = [...restPrev];

      if (isWithinSalesPeriod(date, salesPeriod)) {
        const orderTotal = getOrderTotal(items, shipping);

        let data = prev.filter(({ x }) => x === timestamp)[0];

        if (data) {
          data.y += orderTotal;
        } else {
          data = { x: timestamp, y: orderTotal }
        }

        next.push(data);
      }

      return next;
    }, []);
  }

  static reduceOrder(prev, { OrderItems, shipping }) {
    return prev + MetricsHelper.getOrderTotal(OrderItems, shipping);
  }

  static sortByDate({ date: dateA }, { date: dateB }) {
    return dateB - dateA;
  }

  static getTimestamp(date) {
    const month = date.getUTCMonth() + 1;
    const monthDay = date.getUTCDate();
    const year = date.getUTCFullYear();
    return new Date(`${month} ${monthDay} ${year}`).getTime();
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

  static getSales(orders = [], salesPeriod = 'week') {
    const { getOrdersByType, getSalesGraphData } = MetricsHelper;

    const pendingOrders = getOrdersByType(orders, 'Pending');
    const pending = getSalesGraphData(pendingOrders, salesPeriod);

    const processingOrders = getOrdersByType(orders, 'Processing');
    const processing = getSalesGraphData(processingOrders, salesPeriod);

    const deliveredOrders = getOrdersByType(orders, 'Delivered');
    const delivered = getSalesGraphData(deliveredOrders, salesPeriod);

    const all = getSalesGraphData(orders, salesPeriod);

    return {
      all,
      pending,
      processing,
      delivered
    };
  }
}