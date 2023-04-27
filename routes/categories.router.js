const router = require('express').Router();
const passport = require('passport');
const { validatorHandler, adminCheckHandler } = require('../middlewares/validate.handler');
const { categoryIdSchema, createCategorySchema, updateCategorySchema } = require('../schemas/category.schema');
const CategoriesService = require('../services/categories.services');
const service = new CategoriesService();
// const boom = require('@hapi/boom');

router.get('/',
    async (req, res, next) => {
        // const { size, offset } = req.query;

        try {
            let result = await service.returnCategories();

            res.status(200).json(result);
        }
        catch (err){
            next(err);
        }
    }
);

router.get('/:id',
    validatorHandler(categoryIdSchema, 'params'),
    async (req, res, next) => {
        const { id } = req.params;

        try {
            let result = await service.findCategoryById(id);

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
    validatorHandler(createCategorySchema, 'body'),
    async (req, res, next) => {
        const body = req.body;

        try {
            const result = await service.createCategory(body);

            res.status(201).json(result);
        }
        catch (err){
            next(err);
        }
    }
);

// router.put('/:id',
//     validatorHandler(categoryIdSchema, 'params'),
//     validatorHandler(createCategorySchema, 'body'),
//     async (req, res, next) => {
//         const body = req.body;
//         const { id } = req.params;

//         try {
//             const result = await service.updateCategory(id, body);

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
    validatorHandler(categoryIdSchema, 'params'),
    validatorHandler(updateCategorySchema, 'body'),
    async (req, res, next) => {
        const body = req.body;
        const { id } = req.params;

        try {
            const result = await service.updateCategory(id, body);

            res.status(200).json(result);
        }
        catch (err){
            next(err);
        }
    }
);

router.delete('/:id',
    validatorHandler(categoryIdSchema, 'params'),
    async (req, res, next) => {
        const { id } = req.params;

        try {
            const result = await service.deleteCategory(id);

            res.status(200).json(result);
        }
        catch (err){
            next(err);
        }
    }
);

module.exports = router;