'use strict';

const { DataTypes } = require('sequelize');
const { SHOPPINGCART_TABLE } = require('../models/shopping_cart.model');
const { CUSTOMER_TABLE } = require('../models/customer.model');
const { PRODUCT_TABLE } = require('../models/product.model');

const ShoppingCartSchema = {
    id: {
        unique: true,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
        type: DataTypes.INTEGER,
    },
    customerId: {
        field: 'customer_id',
        allowNull: false,
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        type: DataTypes.INTEGER,
        references: {
            model: CUSTOMER_TABLE,
            key: 'id',
        },
    },
    productId: {
        field: 'product_id',
        allowNull: false,
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        type: DataTypes.INTEGER,
        references: {
            model: PRODUCT_TABLE,
            key: 'id',
        },
    },
    productAmount: {
        field: 'product_amount',
        allowNull: false,
        type: DataTypes.INTEGER,
    },
};

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up (queryInterface) {
        await queryInterface.createTable(SHOPPINGCART_TABLE, ShoppingCartSchema);
    },

    async down (queryInterface) {
        await queryInterface.dropTable(SHOPPINGCART_TABLE);
    }
};