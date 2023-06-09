const Joi = require('joi');

const number = Joi.number().integer();
const name = Joi.string().min(3).max(20);
const image = Joi.string().min(8);
const description = Joi.string().min(20).max(200);
const price = Joi.number().greater(0);

const createProductSchema = Joi.object({
    image,
    name: name.required(),
    price: price.required(),
    description: description.required(),
    categoryId: number.required(),
});

const updateProductSchema = Joi.object({
    name,
    image,
    price,
    description,
    categoryId: number,
});

const productIdSchema = Joi.object({
    id: number.required(),
});

const productQuerySchema = Joi.object({
    page: number,
    categoryId: number,
    itemsPerPage: number,
    minPrice: price,
    maxPrice: price.greater(Joi.ref('minPrice')),
})
.with('minPrice', 'maxPrice')
.with('maxPrice', 'minPrice');

module.exports = { createProductSchema, updateProductSchema, productIdSchema, productQuerySchema };