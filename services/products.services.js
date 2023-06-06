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

    returnProducts({ page = 0, minPrice, maxPrice, categoryId }) {
        return new Promise(async (resolve, reject) => {
            try {
                let itemsPerPage = 10;
                let currentOffset = 0;
                const slicer = page - 1;

                const extraWhereOpts = {};

                if (minPrice && maxPrice) {
                    extraWhereOpts.productPrice = { [Op.between]: [minPrice, maxPrice] }
                }
                if (categoryId) {
                    extraWhereOpts.categoryId = categoryId;
                }

                const productsLength = await this.#PRODUCT.count({ where: extraWhereOpts });
                let maxPage = Math.floor((productsLength - itemsPerPage) / itemsPerPage + 1);
                if (maxPage === 0) maxPage = 1;

                if (page > 0 && page <= maxPage) {
                    if (slicer >= maxPage) {
                        currentOffset = maxPage;
                    }
                    else {
                        currentOffset = itemsPerPage * slicer;
                    }
                }
                else {
                    if (page > maxPage) {
                        currentOffset = productsLength;
                    }
                    itemsPerPage = 0;
                }

                let options = {
                    include: ['category'],
                    attributes: { exclude: ['createdAt', 'updatedAt'] },
                    limit: itemsPerPage || undefined,
                    offset: currentOffset || undefined,
                    where: extraWhereOpts,
                };

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

    updateProduct(id, data) {
        return new Promise(async (resolve, reject) => {
            try {
                const currentProduct = await this.#FIND_PRODUCT(id);

                const dataWithDate = {...data, updatedAt: new Date()};

                const updatedProduct = await currentProduct.update(dataWithDate);

                resolve(updatedProduct);
            }
            catch (error) {
                reject(boom.serverUnavailable(error));
            }
        });
    }

    deleteProduct(id) {
        return new Promise(async (resolve, reject) => {
            try {
                const currentProduct = await this.#FIND_PRODUCT(id);

                await currentProduct.destroy();

                resolve(currentProduct.dataValues);
            }
            catch (error) {
                reject(error);
            }
        });
    }
}


module.exports = ProductsService;