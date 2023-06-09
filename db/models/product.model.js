const { Model, DataTypes, Sequelize } = require('sequelize');
const { CATEGORY_TABLE } = require('./category.model');

const PRODUCT_TABLE = 'products';

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

class Product extends Model {
    static associate(models) {
        this.belongsTo(models.Category, {
            as: 'category',
            hooks: true,
            onDelete: 'cascade',
        });
        this.belongsToMany(models.Customer, {
            as: 'items',
            through: models.ShoppingCart,
            foreignKey: 'productId',
            otherKey: 'customerId',
        });
    }
    static config(sequelize) {
        return {
            sequelize,
            tableName: PRODUCT_TABLE,
            modelName: 'Product',
            timestamps: false,
        }
    }
}

module.exports = { PRODUCT_TABLE, Product, ProductSchema };