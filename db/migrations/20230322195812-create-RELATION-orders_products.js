'use strict';

const { ORDER_PRODUCT_TABLE, Order_ProductSchema } = require('../models/order_products.model');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable(ORDER_PRODUCT_TABLE, Order_ProductSchema);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable(ORDER_PRODUCT_TABLE);
  }
};
