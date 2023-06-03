'use strict';

const { SHOPPINGCART_TABLE, ShoppingCartSchema } = require('../models/shopping_cart.model');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable(SHOPPINGCART_TABLE, ShoppingCartSchema);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable(SHOPPINGCART_TABLE);
  }
};
