const router = require('express').Router();
const { validatorHandler, adminCheckHandler } = require('../middlewares/validate.handler');
const { orderIdSchema, createItemSchema } = require('../schemas/order.schema');
const OrdersService = require('../services/orders.services');
const orderService = new OrdersService();
const ShoppingCartService = require('../services/shoppingcart.services');
const shopcartService = new ShoppingCartService();
const passport = require('passport');
// const boom = require('@hapi/boom');

router.get('/',
    passport.authenticate('jwt', { session: false }),
    adminCheckHandler(),
    async (req, res, next) => {
        try {
            let result = await orderService.returnOrders();
            res.status(200).json(result);
        }
        catch (err){
            next(err);
        }
    }
);

router.get('/user',
    passport.authenticate('jwt', { session: false }),
    async (req, res, next) => {
        const { customer_sub } = req.user;
        try {
            let result = await orderService.returnOrdersByCustomerId(customer_sub);
            res.status(200).json(result);
        }
        catch (err){
            next(err);
        }
    }
);

router.get('/:orderId',
    passport.authenticate('jwt', { session: false }),
    adminCheckHandler(),
    validatorHandler(orderIdSchema, 'params'),
    async (req, res, next) => {
        const { orderId } = req.params;
        try {
            let result = await orderService.findOrderById(orderId);
            res.status(200).json(result);
        }
        catch (err){
            next(err);
        }
    }
);

router.post('/',
    passport.authenticate('jwt', { session: false }),
    async (req, res, next) => {
        const { customer_sub } = req.user;
        try {
            const result = await orderService.createOrder(customer_sub);
            res.status(201).json(result);
        }
        catch (err){
            next(err);
        }
    }
);

router.post('/items',
    passport.authenticate('jwt', { session: false }),
    async (req, res, next) => {
        const body = req.body;
        const { customer_sub } = req.user;

        try {
            const result = await orderService.addItemsToOrder(body, customer_sub);
            await shopcartService.resetShopCart(customer_sub);
            res.status(201).json(result);
        }
        catch (err) {
            next(err);
        }
    }
);

router.post('/items/:id',
    passport.authenticate('jwt', { session: false }),
    validatorHandler(orderIdSchema, 'params'),
    validatorHandler(createItemSchema, 'body'),
    async (req, res, next) => {
        const { customer_sub } = req.user;
        const { id } = req.params;
        const body = req.body;
        body.orderId = Number(id);

        try {
            const result = await orderService.addItemsToOrder(body, customer_sub);
            res.status(201).json(result);
        }
        catch (err) {
            next(err);
        }
    }
);

module.exports = router;