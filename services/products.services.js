const boom = require('@hapi/boom');
const { Op } = require('sequelize');

class ProductsService {

    #SEQUELIZE = require('../libs/sequelize');
    #PRODUCT = this.#SEQUELIZE.models.Product;

    async #FIND_PRODUCT(id, options = undefined){
        const user = await this.#PRODUCT.findByPk(id, options);

        if (user === null){
            throw boom.notFound(`The element with id '${id}' does not exist`);
        }

        return user;
    }

    returnProducts({ page = 0, minPrice, maxPrice }) {
        return new Promise(async (resolve, reject) => {
            try {
                let itemsPerPage = 2;
                let currentOffset = 0;
                const slicer = page - 1;

                const whereOptions = { where: {
                    productPrice: { [Op.between]: [minPrice, maxPrice] }
                }};

                const productsLength = await this.#PRODUCT.count( minPrice && maxPrice ? whereOptions : undefined );
                const maxPage = Math.floor((productsLength - itemsPerPage) / itemsPerPage + 1);

                if (page > 0 && page <= maxPage){
                    if (slicer >= maxPage){
                        currentOffset = maxPage;
                    }
                    else {
                        currentOffset = itemsPerPage * slicer;
                    }
                }
                else {
                    if (page > maxPage){
                        currentOffset = productsLength;
                    }
                    itemsPerPage = 0;
                }

                let options = {
                    include: ['category'],
                    limit: itemsPerPage || undefined,
                    offset: currentOffset || undefined,
                    where: {}
                };

                if (minPrice && maxPrice){
                    options = {...options, where: whereOptions.where}
                }

                const currentQuery = await this.#PRODUCT.findAll(options);

                const dataResult = {
                    products: currentQuery,
                    currentPage: page > 0 ? page : null,
                    maxPage: page > 0 ? maxPage : null,
                };

                resolve(dataResult);
            }
            catch (error) {
                reject(boom.serverUnavailable(error));
            }
        });
    }

    findProductById(id) {
        return new Promise(async (resolve, reject) => {
            try {
                const currentProduct = await this.#FIND_PRODUCT(id);

                resolve(currentProduct.dataValues);
            }
            catch (error) {
                reject(error);
            }
        });
    }

    createProduct(data) {
        return new Promise(async (resolve, reject) => {
            try {
                const newProduct = await this.#PRODUCT.create(data);

                resolve(newProduct);
            }
            catch (error) {
                reject(boom.serverUnavailable(error));
            }
        });
    }

    // putProduct(id, data) {
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

    // patchProduct(id, data) {
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

    // deleteProduct(id) {
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


module.exports = ProductsService;