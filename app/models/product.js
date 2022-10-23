'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }

  Product.init({
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    price: DataTypes.NUMERIC(12, 2),
    active: DataTypes.BOOLEAN,
    // category_id: DataTypes.UUIDV4,
    // inventory_id: DataTypes.UUIDV4,
    // discount_id: DataTypes.UUIDV4
  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};