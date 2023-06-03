const { Op } = require('sequelize');
const boom = require('@hapi/boom');

class ShoppingCartService {

    #SEQUELIZE = require('../libs/sequelize');
    #SHOPCART = this.#SEQUELIZE.models.ShoppingCart;
    #PRODUCT = this.#SEQUELIZE.models.Product;
    #CUSTOMER = this.#SEQUELIZE.models.Customer;

    findItemsByCustomerId(customerId) {
        return new Promise(async (resolve, reject) => {
            try {
                const currentItem = await this.#CUSTOMER.findOne({
                    attributes: [],
                    where: { id: customerId },
                    include: {
                        model: this.#PRODUCT,
                        as: 'items',
                        attributes: ['id', 'name', 'image', 'price', 'description', 'rating'],
                        through: {
                            as: 'cartInfo',
                            attributes: ['productAmount']
                        }
                    },
                });
                resolve(currentItem.items);
            }
            catch (error) {
                console.error(error)
                reject(error);
            }
        });
    }

    createItemForCart(data) {
        return new Promise(async (resolve, reject) => {
            const { customerId, productId } = data;

            try {
                const existItem = await this.#SHOPCART.findOne({
                    where: { [Op.and]: [{ customerId }, { productId }] },
                });

                if (!existItem) {
                    const newItem = await this.#SHOPCART.create(data);
                    resolve(newItem);
                }
                else {
                    reject(boom.conflict('Product already exists in ShoppingCart list.'));
                }
            }
            catch (error) {
                reject(boom.serverUnavailable(error));
            }
        });
    }

    updateAmoutOfItem(data) {
        return new Promise(async (resolve, reject) => {
            const { customerId, productId } = data;

            try {
                const existItem = await this.#SHOPCART.findOne({
                    where: { [Op.and]: [{ customerId }, { productId }] },
                });

                if (existItem) {
                    const updatedItem = await existItem.update({
                        productAmount: data.productAmount,
                    });
                    resolve(updatedItem);
                }
                else {
                    reject(boom.conflict('Check whether your product id exists in ShoppingCart list.'));
                }
            }
            catch (error) {
                reject(boom.serverUnavailable(error));
            }
        });
    }

    deleteItemFromCart(customerId, productId) {
        return new Promise(async (resolve, reject) => {
            try {
                const currentItem = await this.#SHOPCART.findOne({
                    where: { [Op.and]: [{ customerId }, { productId }] },
                });
                await currentItem.destroy();
                resolve(currentItem.dataValues);
            }
            catch (error) {
                reject(error);
            }
        });
    }

    resetShopCart(customerId) {
        return new Promise(async (resolve, reject) => {
            try {
                const currentItem = await this.#SHOPCART.destroy({
                    where: { customerId },
                });
                // await currentItem.destroy();
                resolve(currentItem.dataValues);
            }
            catch (error) {
                reject(error);
            }
        });
    }
}


module.exports = ShoppingCartService;