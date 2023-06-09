'use strict';

const { DataTypes, Sequelize } = require('sequelize');
const { USER_TABLE } = require('../models/user.model');

const UserSchema = {
    id: {
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
        type: DataTypes.INTEGER,
    },
    firstName: {
        field: 'first_name',
        allowNull: false,
        type: DataTypes.STRING,
    },
    lastName: {
        field: 'last_name',
        allowNull: false,
        type: DataTypes.STRING,
    },
    email: {
        unique: true,
        allowNull: false,
        type: DataTypes.STRING,
    },
    password: {
        allowNull: false,
        type: DataTypes.STRING,
    },
    recoveryToken: {
        field: 'recovery_token',
        allowNull: true,
        type: DataTypes.STRING,
    },
    role: {
        allowNull: false,
        defaultValue: 'customer',
        type: DataTypes.STRING,
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
};

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up (queryInterface) {
        await queryInterface.createTable(USER_TABLE, UserSchema);
    },

    async down (queryInterface) {
        await queryInterface.dropTable(USER_TABLE);
    }
};