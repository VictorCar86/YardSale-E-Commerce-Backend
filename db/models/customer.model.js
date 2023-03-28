const { Model, DataTypes, /* Sequelize */ } = require('sequelize');
const { USER_TABLE } = require('./user.model');

const CUSTOMER_TABLE = 'customers';

const CustomerSchema = {
    id: {
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
            key: 'id'
        }
    },
};

class Customer extends Model {
    static associate(models){
        this.belongsTo(models.User, { as: 'user' });
        this.hasMany(models.Order, {
            as: 'orders',
            foreignKey: 'customerId'
        });
    }
    static config(sequelize){
        return {
            sequelize,
            tableName: CUSTOMER_TABLE,
            modelName: 'Customer',
            timestamps: false,
        }
    }
}

module.exports = { CUSTOMER_TABLE, Customer, CustomerSchema };