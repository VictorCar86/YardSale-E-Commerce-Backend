const Joi = require('joi');
const { userInfoSchema } = require('./user.schema');

const id = Joi.number().integer();
const realNumber = Joi.number();

const customerInfoSchema = Joi.object({
    rating: realNumber,
    user: userInfoSchema,
});

const patchCustomerSchema = Joi.object({
    rating: realNumber.required(),
    user_id: id.required(),
});

const customerIdSchema = Joi.object({
    id: id.required(),
});

module.exports = { customerInfoSchema, patchCustomerSchema, customerIdSchema }