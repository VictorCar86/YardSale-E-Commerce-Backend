const Joi = require('joi');

const number = Joi.number().integer();
const productName = Joi.string().min(3).max(20);
const productImage = Joi.string().min(8);
const productDescription = Joi.string().alphanum().min(20).max(200);
const productPrice = Joi.number().greater(0);

const createProductSchema = Joi.object({
    productImage,
    productName: productName.required(),
    productPrice: productPrice.required(),
    productDescription: productDescription.required(),
    categoryId: number.required(),
});

const updateProductSchema = Joi.object({
    productName,
    productImage,
    productPrice,
    productDescription,
    categoryId: number,
});

const productIdSchema = Joi.object({
    id: number.required(),
});

const productQuerySchema = Joi.object({
    page: number,
    minPrice: productPrice,
    maxPrice: productPrice.greater(Joi.ref('minPrice')),
})
.with('minPrice', 'maxPrice')
.with('maxPrice', 'minPrice');

module.exports = { createProductSchema, updateProductSchema, productIdSchema, productQuerySchema };