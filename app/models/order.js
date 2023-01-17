'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    static associate(models) {
      this.belongsTo(models.OrderStatus, { foreignKey: 'status_id' });
      this.hasMany(models.OrderItem, { foreignKey: 'order_id' });
    }
  }
  Order.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    recipient_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    address: DataTypes.STRING,
    phone: DataTypes.STRING,
    payment: DataTypes.STRING,
    status_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'Order'
  });
  return Order;
};