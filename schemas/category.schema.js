const Joi = require('joi');

const id = Joi.number().integer();
const name = Joi.string().alphanum().max(60);
const image = Joi.string().min(8);

const createCategorySchema = Joi.object({
    name: name.required(),
    image: image.required(),
});

const updateCategorySchema = Joi.object({
    name,
    image,
});

const categoryIdSchema = Joi.object({
    id: id.required(),
});

module.exports = { createCategorySchema, updateCategorySchema, categoryIdSchema };