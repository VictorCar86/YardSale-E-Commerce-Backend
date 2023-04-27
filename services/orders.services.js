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

    returnOrdersByUserId(id) {
        return new Promise(async (resolve, reject) => {
            try {
                const queryOptions = {
                    where: {
                        '$customer.user.id$': id,
                    },
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

                const currentQuery = await this.#ORDER.findAll(queryOptions);

                resolve(currentQuery);
            }
            catch (error) {
                reject(boom.serverUnavailable(error));
            }
        });
    }

    findOrderById(id) {
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

                const currentOrder = await this.#FIND_ORDER(id, queryOptions);

                resolve(currentOrder.dataValues);
            }
            catch (error) {
                reject(error);
            }
        });
    }

    createOrder(userId) {
        return new Promise(async (resolve, reject) => {
            try {
                const customer = await this.#CUSTOMER.findOne({
                    where: { userId }
                });

                const newOrder = await this.#ORDER.create({ customerId: customer.id });

                resolve(newOrder);
            }
            catch (error) {
                reject(boom.serverUnavailable(error));
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

    deleteOrder(id) {
        return new Promise(async (resolve, reject) => {
            try {
                const currentOrder = await this.#FIND_ORDER(id);

                await currentOrder.destroy();

                resolve(currentOrder.dataValues);
            }
            catch (error) {
                reject(error);
            }
        });
    }

    /* Order_Product */
    addItems(data) {
        return new Promise(async (resolve, reject) => {
            try {
                const newOrder_Product = await this.#ORDER_PRODUCT.create(data);

                resolve(newOrder_Product);
            }
            catch (error) {
                reject(boom.serverUnavailable(error));
            }
        });
    }
}

module.exports = OrdersService;