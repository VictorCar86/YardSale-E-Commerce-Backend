"use strict";

const { DataTypes, Sequelize } = require("sequelize");
const { CATEGORY_TABLE } = require("../models/category.model");

const CategorySchema = {
    id: {
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
        type: DataTypes.INTEGER,
    },
    name: {
        allowNull: false,
        unique: true,
        type: DataTypes.STRING,
    },
    image: {
        allowNull: true,
        unique: false,
        type: DataTypes.STRING,
    },
    createdAt: {
        field: "created_at",
        allowNull: false,
        defaultValue: Sequelize.NOW,
        type: DataTypes.DATE,
    },
    updatedAt: {
        field: "updated_at",
        allowNull: true,
        type: DataTypes.DATE,
    },
};

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface) {
        await queryInterface.createTable(CATEGORY_TABLE, CategorySchema);
    },

    async down(queryInterface) {
        await queryInterface.dropTable(CATEGORY_TABLE);
    },
};
