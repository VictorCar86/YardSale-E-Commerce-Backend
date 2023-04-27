const { Model, DataTypes, Sequelize } = require('sequelize');
const { CUSTOMER_TABLE } = require('./customer.model');

const ORDER_TABLE = 'orders';

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

class Order extends Model {
    static associate(models){
        this.belongsTo(models.Customer, {
			as: 'customer',
			hooks: true,
            onDelete: 'cascade',
		});
        this.belongsToMany(models.Product, {
            as: 'items',
            through: models.Order_Product,
            foreignKey: 'orderId',
            otherKey: 'productId'
        });
    }
    static config(sequelize){
        return {
            sequelize,
            tableName: ORDER_TABLE,
            modelName: 'Order',
            timestamps: false,
        }
    }
}

module.exports = { ORDER_TABLE, Order, OrderSchema };