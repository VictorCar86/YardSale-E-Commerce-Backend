const boom = require('@hapi/boom');

class CustomersService {

    #SEQUELIZE = require('../libs/sequelize');
    #CUSTOMER = this.#SEQUELIZE.models.Customer;

    async #FIND_CUSTOMER(id){
        const user = await this.#CUSTOMER.findByPk(id);

        if (user === null){
            throw boom.notFound(`The element with id '${id}' does not exist`);
        }

        return user;
    }

    returnCustomers() {
        return new Promise(async (resolve, reject) => {
            try {
                // delete this.#CUSTOMER.prototype.rawAttributes.userId;
                console.log(this.#CUSTOMER.prototype)

                const currentQuery = await this.#CUSTOMER.findAll({
                    include: ['user']
                });

                resolve(currentQuery);
            }
            catch (error) {
                reject(boom.serverUnavailable(error));
            }
        })
    }

    // findCustomerById(id) {
    //     return new Promise(async (resolve, reject) => {
    //         try {
    //             const currentCustomer = await this.#FIND_CUSTOMER(id);

    //             resolve(currentCustomer.dataValues);
    //         }
    //         catch (error) {
    //             reject(error);
    //         }
    //     });
    // }

    createCustomer(data) {
        return new Promise(async (resolve, reject) => {
            try {
                const newCustomer = await this.#CUSTOMER.create(data, {
                    include: ['user']
                });

                resolve(newCustomer);
            }
            catch (error) {
                reject(boom.serverUnavailable(error));
            }
        });
    }

    updateCustomer(id, data) {
        return new Promise(async (resolve, reject) => {
            try {
                const currentCustomer = await this.#FIND_CUSTOMER(id);

                const dataWithDate = {...data, updated_at: new Date()};

                const updatedCustomer = await currentCustomer.update(dataWithDate);

                resolve(updatedCustomer);
            }
            catch (error) {
                reject(boom.serverUnavailable(error));
            }
        });
    }

    // deleteCustomer(id) {
    //     return new Promise(async (resolve, reject) => {
    //         try {
    //             const currentCustomer = await this.#FIND_CUSTOMER(id);

    //             await currentCustomer.destroy();

    //             resolve(currentCustomer.dataValues);
    //         }
    //         catch (error) {
    //             reject(error);
    //         }
    //     })
    // }
}


module.exports = CustomersService;