const router = require('express').Router();
const validatorHandler = require('../middlewares/validate.handler');
const { orderIdSchema, createOrderSchema, createItemSchema } = require('../schemas/order.schema');
const OrdersService = require('../services/orders.services');
const service = new OrdersService();
// const boom = require('@hapi/boom');

router.get('/',
    async (req, res, next) => {
        // const { size, offset } = req.query;

        try {
            let result = await service.returnOrders();

            // if (offset){
            //     result = result.slice(parseInt(offset));
            // }
            // if (size){
            //     result = result.slice(0, parseInt(size));
            // }

            res.status(200).json(result);
        }
        catch (err){
            next(err);
        }
    }
);

router.get('/:id',
    validatorHandler(orderIdSchema, 'params'),
    async (req, res, next) => {
        const { id } = req.params;

        try {
            let result = await service.findOrderById(id);

            res.status(200).json(result);
        }
        catch (err){
            next(err);
        }
    }
);

router.post('/',
    validatorHandler(createOrderSchema, 'body'),
    async (req, res, next) => {
        const body = req.body;

        try {
            const result = await service.createOrder(body);

            res.status(201).json({
                data: result,
            });
        }
        catch (err){
            next(err);
        }
    }
);

router.post('/:id/items',
    validatorHandler(orderIdSchema, 'params'),
    validatorHandler(createItemSchema, 'body'),
    async (req, res, next) => {
        const { id } = req.params;
        const body = req.body;

        try {
            const result = await service.addItems({orderId: Number(id), ...body});

            res.status(201).json({
                data: result,
            });
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

// router.patch('/:id',
//     validatorHandler(categoryIdSchema, 'params'),
//     validatorHandler(updateCategorySchema, 'body'),
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

// router.delete('/:id',
//     validatorHandler(categoryIdSchema, 'params'),
//     async (req, res, next) => {
//         const { id } = req.params;

//         try {
//             const result = await service.deleteUser(id);

//             res.status(200).json({
//                 data: result,
//             });
//         }
//         catch (err){
//             next(err);
//         }
//     }
// );

module.exports = router;