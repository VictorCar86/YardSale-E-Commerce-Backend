'use strict';

const { DataTypes, Sequelize } = require('sequelize');
const { ORDER_TABLE } = require('../models/order.model');
const { CUSTOMER_TABLE } = require('../models/customer.model');

const OrderSchema = {
	id: {
		allowNull: false,
		autoIncrement: true,
		primaryKey: true,
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
	createdAt: {
		allowNull: false,
		type: DataTypes.DATE,
		field: 'created_at',
		defaultValue: Sequelize.NOW,
	},
};

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up (queryInterface) {
        await queryInterface.createTable(ORDER_TABLE, OrderSchema);
    },

    async down (queryInterface) {
        await queryInterface.dropTable(ORDER_TABLE);
    }
};