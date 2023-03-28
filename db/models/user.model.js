const { Model, DataTypes, Sequelize } = require('sequelize');

const USER_TABLE = 'users';

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

class User extends Model {
    static associate(models){
        this.hasOne(models.Customer, { as: 'customer', foreignKey: 'userId' });
    }
    static config(sequelize){
        return {
            sequelize,
            tableName: USER_TABLE,
            modelName: 'User',
            timestamps: false,
        }
    }
}

module.exports = { USER_TABLE, User, UserSchema };