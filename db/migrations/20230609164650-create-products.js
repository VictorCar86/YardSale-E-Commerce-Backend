'use strict';

const { DataTypes, Sequelize } = require('sequelize');
const { CATEGORY_TABLE } = require('./category.model');
const { PRODUCT_TABLE } = require('../models/product.model');

const ProductSchema = {
    id: {
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
        type: DataTypes.INTEGER,
    },
    name: {
        allowNull: false,
        type: DataTypes.STRING,
    },
    image: {
        allowNull: true,
        type: DataTypes.TEXT,
    },
    price: {
        allowNull: false,
        type: DataTypes.REAL,
    },
    rating: {
        allowNull: true,
        type: DataTypes.REAL,
    },
    description: {
        allowNull: false,
        type: DataTypes.TEXT,
    },
    createdAt: {
        field: 'created_at',
        allowNull: false,
        defaultValue: Sequelize.NOW,
        type: DataTypes.DATE,
    },
    updatedAt: {
        field: 'updated_at',
        allowNull: true,
        type: DataTypes.DATE,
    },
    categoryId: {
        field: 'category_id',
        allowNull: false,
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        type: DataTypes.INTEGER,
        references: {
            model: CATEGORY_TABLE,
            key: 'id',
        }
    },
};

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up (queryInterface) {
        await queryInterface.createTable(PRODUCT_TABLE, ProductSchema);
    },

    async down (queryInterface) {
        await queryInterface.dropTable(PRODUCT_TABLE);
    }
};