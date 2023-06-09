'use strict';

const { DataTypes, Sequelize } = require('sequelize');
const { ORDER_PRODUCT_TABLE } = require('../models/order_products.model');
const { ORDER_TABLE } = require('./order.model');
const { PRODUCT_TABLE } = require('./product.model');

const Order_ProductSchema = {
    id: {
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
        type: DataTypes.INTEGER,
    },
    productAmount: {
        field: 'product_amount',
        allowNull: false,
        type: DataTypes.INTEGER,
    },
    orderId: {
        field: 'order_id',
        allowNull: false,
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        type: DataTypes.INTEGER,
        references: {
            model: ORDER_TABLE,
            key: 'id'
        }
    },
    productId: {
        field: 'product_id',
        allowNull: false,
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        type: DataTypes.INTEGER,
        references: {
            model: PRODUCT_TABLE,
            key: 'id'
        }
    },
    updatedAt: {
        field: 'updated_at',
        allowNull: true,
        type: DataTypes.DATE,
    },
    createdAt: {
		field: 'created_at',
		allowNull: false,
		type: DataTypes.DATE,
		defaultValue: Sequelize.NOW,
	},
};

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up (queryInterface) {
        await queryInterface.createTable(ORDER_PRODUCT_TABLE, Order_ProductSchema);
    },

    async down (queryInterface) {
        await queryInterface.dropTable(ORDER_PRODUCT_TABLE);
    }
};