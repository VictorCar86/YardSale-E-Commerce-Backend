const boom = require("@hapi/boom");

class CategoriesService {
    #SEQUELIZE = require("../libs/sequelize");
    #CATEGORY = this.#SEQUELIZE.models.Category;

    async #FIND_CATEGORY(id, options = undefined) {
        const user = await this.#CATEGORY.findByPk(id, options);

        if (user === null) {
            throw boom.notFound(`The element with id '${id}' does not exist`);
        }

        return user;
    }

    returnCategories() {
        return new Promise(async (resolve, reject) => {
            try {
                const currentQuery = await this.#CATEGORY.findAll();

                resolve(currentQuery);
            } catch (error) {
                reject(boom.serverUnavailable(error));
            }
        });
    }

    findCategoryById(id) {
        return new Promise(async (resolve, reject) => {
            try {
                const currentCategory = await this.#FIND_CATEGORY(id, {
                    include: ["products"],
                });

                resolve(currentCategory.dataValues);
            } catch (error) {
                reject(error);
            }
        });
    }

    createCategory(data) {
        return new Promise(async (resolve, reject) => {
            try {
                if (Array.isArray(data)) {
                    resolve(await this.#CATEGORY.bulkCreate(data));
                }
                if (typeof data === "object") {
                    resolve(await this.#CATEGORY.create(data));
                }
            } catch (error) {
                reject(boom.serverUnavailable(error));
            }
        });
    }

    updateCategory(id, data) {
        return new Promise(async (resolve, reject) => {
            try {
                const currentCategory = await this.#FIND_CATEGORY(id);

                const dataWithDate = { ...data, updatedAt: new Date() };

                const updatedCategory = await currentCategory.update(dataWithDate);

                resolve(updatedCategory);
            } catch (error) {
                reject(boom.serverUnavailable(error));
            }
        });
    }

    deleteCategory(id) {
        return new Promise(async (resolve, reject) => {
            try {
                const currentCategory = await this.#FIND_CATEGORY(id);

                await currentCategory.destroy();

                resolve(currentCategory.dataValues);
            } catch (error) {
                reject(error);
            }
        });
    }
}

module.exports = CategoriesService;
