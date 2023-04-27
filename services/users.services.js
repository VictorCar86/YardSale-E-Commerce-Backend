const boom = require('@hapi/boom');

class UsersService {

    #SEQUELIZE = require('../libs/sequelize');
    #USER = this.#SEQUELIZE.models.User;

    async #FIND_USER(id){
        const user = await this.#USER.findByPk(id);

        if (user === null){
            throw boom.notFound(`The element with id '${id}' does not exist`);
        }

        return user;
    }

    // returnUsers() {
    //     return new Promise(async (resolve, reject) => {
    //         try {
    //             const currentQuery = await this.#USER.findAll();

    //             resolve(currentQuery);
    //         }
    //         catch (error) {
    //             reject(boom.serverUnavailable(error));
    //         }
    //     })
    // }

    findUserById(id) {
        return new Promise(async (resolve, reject) => {
            try {
                const currentUser = await this.#FIND_USER(id);

                resolve(currentUser.dataValues);
            }
            catch (error) {
                reject(error);
            }
        })
    }

    findUserByEmail(email) {
        return new Promise(async (resolve, reject) => {
            try {
                const currentEmail = await this.#USER.findOne({
                    where: { email }
                });

                resolve(currentEmail);
            }
            catch (error) {
                console.log(error)
                reject(error);
            }
        })
    }

    // createUser(data) {
    //     return new Promise(async (resolve, reject) => {
    //         try {
    //             const newUser = await this.#USER.create(data);

    //             resolve(newUser);
    //         }
    //         catch (error) {
    //             reject(boom.serverUnavailable(error));
    //         }
    //     });
    // }

    updateUser(id, data) {
        return new Promise(async (resolve, reject) => {
            try {
                const currentUser = await this.#FIND_USER(id);

                const dataWithDate = {...data, updated_at: new Date()};

                const updatedUser = await currentUser.update(dataWithDate);

                resolve(updatedUser);
            }
            catch (error) {
                reject(boom.serverUnavailable(error));
            }
        });
    }

    // deleteUser(id) {
    //     return new Promise(async (resolve, reject) => {
    //         try {
    //             const currentUser = await this.#FIND_USER(id);

    //             await currentUser.destroy();

    //             resolve(currentUser.dataValues);
    //         }
    //         catch (error) {
    //             reject(error);
    //         }
    //     })
    // }
}


module.exports = UsersService;