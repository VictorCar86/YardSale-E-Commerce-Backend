const router = require('express').Router();
const { validatorHandler } = require('../middlewares/validate.handler');
const { productIdSchema, createProductSchema, productQuerySchema, updateProductSchema } = require('../schemas/product.schema');
const ProductsService = require('../services/products.services');
const service = new ProductsService();
// const boom = require('@hapi/boom');

router.get('/',
    validatorHandler(productQuerySchema, 'query'),
    async (req, res, next) => {
        const { page } = req.query;

        let currentPage = page;

        if (page){
            currentPage = Number(page);
        }

        try {
            const result = await service.returnProducts({ ...req.query, page: currentPage });

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

// router.put('/:id',
//     validatorHandler(productIdSchema, 'params'),
//     validatorHandler(createProductSchema, 'body'),
//     async (req, res, next) => {
//         const body = req.body;
//         const { id } = req.params;

//         try {
//             const result = await service.updateUser(id, body);

//             res.status(200).json({
//                 data: result,
//             });
//         }
//         catch (err){
//             next(err);
//         }
//     }
// );

router.patch('/:id',
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