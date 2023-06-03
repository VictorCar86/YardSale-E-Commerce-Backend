const boom = require('@hapi/boom');

class UsersService {

    #SEQUELIZE = require('../libs/sequelize');
    #USER = this.#SEQUELIZE.models.User;

    async #FIND_USER(userId, options = {}){
        const user = await this.#USER.findByPk(userId, options);

        if (user === null){
            throw boom.notFound();
        }

        return user;
    }

    returnUsers() {
        return new Promise(async (resolve, reject) => {
            try {
                const currentQuery = await this.#USER.findAll();
                resolve(currentQuery);
            }
            catch (error) {
                reject(error);
            }
        })
    }

    findUserById(userId) {
        return new Promise(async (resolve, reject) => {
            try {
                const currentUser = await this.#FIND_USER(userId, {
                    attributes: ['firstName', 'lastName', 'email', 'role'],
                });

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
                    where: { email },
                    include: ['customer'],
                });

                resolve(currentEmail);
            }
            catch (error) {
                console.log(error)
                reject(error);
            }
        })
    }

    findRecoveryTokenById(userId) {
        return new Promise(async (resolve, reject) => {
            try {
                const currentUser = await this.#FIND_USER(userId, {
                    attributes: ['recoveryToken'],
                });
                resolve(currentUser.recoveryToken);
            }
            catch (error) {
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

    updateUser(userId, data) {
        return new Promise(async (resolve, reject) => {
            try {
                const currentUser = await this.#FIND_USER(userId);
                const dataWithDate = {...data, updated_at: new Date()};

                const { firstName, lastName, email, role } = await currentUser.update(dataWithDate);
                resolve({ firstName, lastName, email, role });
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