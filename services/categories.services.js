const boom = require('@hapi/boom');

class CategoriesService {

    #SEQUELIZE = require('../libs/sequelize');
    #CATEGORY = this.#SEQUELIZE.models.Category;

    async #FIND_CATEGORY(id, options = undefined){
        const user = await this.#CATEGORY.findByPk(id, options);

        if (user === null){
            throw boom.notFound(`The element with id '${id}' does not exist`);
        }

        return user;
    }

    returnCategories() {
        return new Promise(async (resolve, reject) => {
            try {
                const currentQuery = await this.#CATEGORY.findAll();

                resolve(currentQuery);
            }
            catch (error) {
                reject(boom.serverUnavailable(error));
            }
        })
    }

    findCustomerById(id) {
        return new Promise(async (resolve, reject) => {
            try {
                const currentCustomer = await this.#FIND_CATEGORY(id, { include: ['products'] });

                resolve(currentCustomer.dataValues);
            }
            catch (error) {
                reject(error);
            }
        });
    }

    createCategory(data) {
        return new Promise(async (resolve, reject) => {
            try {
                const newCategory = await this.#CATEGORY.create(data);

                resolve(newCategory);
            }
            catch (error) {
                reject(boom.serverUnavailable(error));
            }
        });
    }

    // putCategory(id, data) {
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

    // patchCategory(id, data) {
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

    // deleteCategory(id) {
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


module.exports = CategoriesService;