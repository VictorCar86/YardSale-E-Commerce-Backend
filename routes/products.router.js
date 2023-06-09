const router = require('express').Router();
const passport = require('passport');
const { validatorHandler, adminCheckHandler } = require('../middlewares/validate.handler');
const { productIdSchema, createProductSchema, productQuerySchema, updateProductSchema } = require('../schemas/product.schema');
const ProductsService = require('../services/products.services');
const service = new ProductsService();
// const boom = require('@hapi/boom');

router.get('/',
    validatorHandler(productQuerySchema, 'query'),
    async (req, res, next) => {
        let { page, itemsPerPage } = req.query;

        if (page){
            req.query.page = Number(page);
        }
        if (itemsPerPage){
            req.query.itemsPerPage = Number(itemsPerPage);
        }

        try {
            const result = await service.returnProducts(req.query);
            res.status(200).json(result);
        }
        catch (err){
            next(err);
        }
    }
);

router.get('/:id',
    validatorHandler(productIdSchema, 'params'),
    async (req, res, next) => {
        const { id } = req.params;

        try {
            let result = await service.findProductById(id);
            res.status(200).json(result);
        }
        catch (err){
            next(err);
        }
    }
);

router.post('/',
    passport.authenticate('jwt', { session: false }),
    adminCheckHandler(),
    validatorHandler(createProductSchema, 'body'),
    async (req, res, next) => {
        const body = req.body;

        try {
            const result = await service.createProduct(body);

            res.status(201).json(result);
        }
        catch (err){
            next(err);
        }
    }
);

router.patch('/:id',
    passport.authenticate('jwt', { session: false }),
    adminCheckHandler(),
    validatorHandler(productIdSchema, 'params'),
    validatorHandler(updateProductSchema, 'body'),
    async (req, res, next) => {
        const body = req.body;
        const { id } = req.params;

        try {
            const result = await service.updateProduct(id, body);
            res.status(200).json(result);
        }
        catch (err){
            next(err);
        }
    }
);

router.delete('/:id',
    passport.authenticate('jwt', { session: false }),
    adminCheckHandler(),
    validatorHandler(productIdSchema, 'params'),
    async (req, res, next) => {
        const { id } = req.params;

        try {
            const result = await service.deleteProduct(id);
            res.status(200).json(result);
        }
        catch (err){
            next(err);
        }
    }
);

module.exports = router;