const Joi = require('joi');

const id = Joi.number().integer();
const names = Joi.string();
const email = Joi.string().email();
const password = Joi.string().min(8);
const role = Joi.string().min(5)

const userInfoSchema = Joi.object({
    email: email.required(),
    password: password.required(),
    first_name: names.required(),
    last_name: names.required(),
    role: role.required()
});

const patchUserSchema = Joi.object({
    email: email,
    password: password,
    first_name: names,
    last_name: names,
    role: role,
});

const userIdSchema = Joi.object({
    id: id.required(),
});

module.exports = { userInfoSchema, patchUserSchema, userIdSchema }