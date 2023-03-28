const Joi = require('joi');

const id = Joi.number().integer();
const categoryName = Joi.string().alphanum().max(60);
const categoryImage = Joi.string().min(8);

const createCategorySchema = Joi.object({
    categoryName: categoryName.required(),
    categoryImage: categoryImage.required(),
});

const updateCategorySchema = Joi.object({
    categoryName,
    categoryImage,
});

const categoryIdSchema = Joi.object({
    id: id.required(),
});

module.exports = { createCategorySchema, updateCategorySchema, categoryIdSchema };