const { Model, DataTypes, Sequelize } = require('sequelize');

const CATEGORY_TABLE = 'categories';

const CategorySchema = {
    id: {
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
        type: DataTypes.INTEGER,
    },
    categoryName: {
        field: 'category_name',
        allowNull: false,
        type: DataTypes.STRING,
    },
    categoryImage: {
        field: 'category_image',
        allowNull: false,
        unique: true,
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

class Category extends Model {
    static associate(models){
        this.hasMany(models.Product, {
            as: 'products',
            foreignKey: 'categoryId'
        });
    }
    static config(sequelize){
        return {
            sequelize,
            tableName: CATEGORY_TABLE,
            modelName: 'Category',
            timestamps: false,
        }
    }
}

module.exports = { CATEGORY_TABLE, Category, CategorySchema };