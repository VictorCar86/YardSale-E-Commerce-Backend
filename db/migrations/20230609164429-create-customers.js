'use strict';

const { DataTypes } = require('sequelize');
const { CUSTOMER_TABLE } = require('../models/customer.model');
const { USER_TABLE } = require('../models/user.model');

const CustomerSchema = {
    id: {
        unique: true,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
        type: DataTypes.INTEGER,
    },
    rating: {
        allowNull: true,
        defaultValue: null,
        type: DataTypes.REAL,
    },
    updatedAt: {
        field: 'updated_at',
        allowNull: true,
        type: DataTypes.DATE,
    },
    userId: {
        unique: true,
        field: 'user_id',
        allowNull: false,
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        type: DataTypes.INTEGER,
        references: {
            model: USER_TABLE,
            key: 'id',
        }
    },
};

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up (queryInterface) {
        await queryInterface.createTable(CUSTOMER_TABLE, CustomerSchema);
    },

    async down (queryInterface) {
        await queryInterface.dropTable(CUSTOMER_TABLE);
    }
};