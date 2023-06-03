const boom = require('@hapi/boom');

class OrdersService {

    #SEQUELIZE = require('../libs/sequelize');
    #CUSTOMER = this.#SEQUELIZE.models.Customer;
    #USER = this.#SEQUELIZE.models.User;
    #ORDER = this.#SEQUELIZE.models.Order;
    #ORDER_PRODUCT = this.#SEQUELIZE.models.Order_Product;

    async #FIND_ORDER(id, options = undefined){
        const user = await this.#ORDER.findByPk(id, options);

        if (user === null){
            throw boom.notFound(`The element with id '${id}' does not exist`);
        }

        return user;
    }

    createOrder(customerId) {
        return new Promise(async (resolve, reject) => {
            try {
                const newOrder = await this.#ORDER.create({ customerId });
                resolve(newOrder);
            }
            catch (error) {
                reject(boom.serverUnavailable(error));
            }
        });
    }

    returnOrders() {
        return new Promise(async (resolve, reject) => {
            try {
                const currentQuery = await this.#ORDER.findAll();
                resolve(currentQuery);
            }
            catch (error) {
                reject(boom.serverUnavailable(error));
            }
        });
    }

    returnOrdersByCustomerId(customerId) {
        return new Promise(async (resolve, reject) => {
            try {
                const queryOptions = {
                    attributes: {
                        exclude: ['id', 'customerId'],
                    },
                    where: { customerId },
                    include: [
                        {
                            association: 'items',
                            attributes: { exclude: ['createdAt', 'updatedAt'] },
                        },
                    ],
                };

                const currentQuery = await this.#ORDER.findAll(queryOptions);

                resolve(currentQuery);
            }
            catch (error) {
                reject(boom.serverUnavailable(error));
            }
        });
    }

    findOrderById(orderId) {
        return new Promise(async (resolve, reject) => {
            try {
                const queryOptions = {
                    include: ['items',
                        {
                            association: 'customer',
                            include: [{
                                model: this.#USER,
                                as: 'user',
                                attributes: { exclude: ['password'] },
                            }],
                        }
                    ],
                };
                const currentOrder = await this.#FIND_ORDER(orderId, queryOptions);

                resolve(currentOrder.dataValues);
            }
            catch (error) {
                reject(error);
            }
        });
    }

    updateOrder(id, data) {
        return new Promise(async (resolve, reject) => {
            try {
                const currentOrder = await this.#FIND_ORDER(id);

                const dataWithDate = {...data, updatedAt: new Date()};

                const updatedOrder = await currentOrder.update(dataWithDate);

                resolve(updatedOrder);
            }
            catch (error) {
                reject(boom.serverUnavailable(error));
            }
        });
    }

    deleteOrder(orderId) {
        return new Promise(async (resolve, reject) => {
            try {
                const currentOrder = await this.#FIND_ORDER(orderId);

                await currentOrder.destroy();

                resolve(currentOrder.dataValues);
            }
            catch (error) {
                reject(error);
            }
        });
    }

    /* Order_Product */
    addItemsToOrder(data, customerId) {
        return new Promise(async (resolve, reject) => {
            try {
                if (!data.orderId && Array.isArray(data.products)){
                    const newOrder = await this.createOrder(customerId);
                    data.products = data.products.map(product => {
                        return { ...product, orderId: newOrder.id };
                    });
                    await this.#ORDER_PRODUCT.bulkCreate(data.products);
                }
                else {
                    await this.#ORDER_PRODUCT.create(data);
                }
                const currentOrdersState = await this.returnOrdersByCustomerId(customerId);
                resolve(currentOrdersState);
            }
            catch (error) {
                reject(boom.serverUnavailable(error));
            }
        });
    }
}

module.exports = OrdersService;