const { Model, DataTypes, /* Sequelize */ } = require('sequelize');
const { CUSTOMER_TABLE } = require('./customer.model');
const { PRODUCT_TABLE } = require('./product.model');

const SHOPPINGCART_TABLE = 'shopping_cart';

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

class ShoppingCart extends Model {
    // static associate(models) {
    //     //
    // }
    static config(sequelize) {
        return {
            sequelize,
            tableName: SHOPPINGCART_TABLE,
            modelName: 'ShoppingCart',
            timestamps: false,
        }
    }
}

module.exports = { SHOPPINGCART_TABLE, ShoppingCart, ShoppingCartSchema };