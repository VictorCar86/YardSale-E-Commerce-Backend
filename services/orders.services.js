const boom = require('@hapi/boom');

class OrdersService {

    #SEQUELIZE = require('../libs/sequelize');
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

    findOrderById(id) {
        return new Promise(async (resolve, reject) => {
            try {
                const currentOrder = await this.#FIND_ORDER(id, {
                    include: [
                        'items',
                        {
                            association: 'customer',
                            include: ['user'],
                        }
                    ],
                });

                resolve(currentOrder.dataValues);
            }
            catch (error) {
                reject(error);
            }
        });
    }

    createOrder(data) {
        return new Promise(async (resolve, reject) => {
            try {
                const newOrder = await this.#ORDER.create(data);

                resolve(newOrder);
            }
            catch (error) {
                reject(boom.serverUnavailable(error));
            }
        });
    }

    addItems(data) {
        return new Promise(async (resolve, reject) => {
            try {
                const newOrder = await this.#ORDER_PRODUCT.create(data);

                resolve(newOrder);
            }
            catch (error) {
                reject(boom.serverUnavailable(error));
            }
        });
    }

    // putOrder(id, data) {
    //     const { firstName, lastName } = data;
    //     const index = this.usersList.findIndex(e => {
    //         return e.userId === parseInt(id)
    //     });

    //     if (index >= 0){
    //         const newObj = {
    //             ...this.usersList[index],
    //             firstName,
    //             lastName
    //         };
    //         this.usersList[index] = newObj;

    //         return { status: "done" }
    //     }
    //     else {
    //         return { status: "not found" }
    //     }
    // }

    // patchOrder(id, data) {
    //     const { firstName, lastName } = data;
    //     const index = this.usersList.findIndex(elem => {
    //         return elem.userId === parseInt(id);
    //     });

    //     if (index >= 0){
    //         const newObj = {
    //             ...this.usersList[index],
    //             firstName,
    //             lastName
    //         };
    //         this.usersList[index] = newObj;

    //         return { status: "done" }
    //     }
    //     else {
    //         return { status: "not found" }
    //     }
    // }

    // deleteOrder(id) {
    //     const index = this.usersList.findIndex(elem => {
    //         return elem.userId === parseInt(id)
    //     });

    //     if (index >= 0){
    //         this.usersList.splice(index, 1);
    //         return { status: "done", id }
    //     }
    //     else {
    //         return { status: "not found", id }
    //     }
    // }
}

module.exports = OrdersService;