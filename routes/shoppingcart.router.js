const router = require('express').Router();
const passport = require('passport');
// const { /*validatorHandler,*/ } = require('../middlewares/validate.handler');
const ShoppingCartService = require('../services/shoppingcart.services');
const service = new ShoppingCartService();
// const boom = require('@hapi/boom');

router.get('/',
    passport.authenticate('jwt', { session: false }),
    async (req, res, next) => {
        const { customer_sub } = req.user;
        try {
            const currentCart = await service.findItemsByCustomerId(customer_sub);
            res.status(200).json(currentCart);
        }
        catch (err){
            next(err);
        }
    }
);

router.post('/:productId',
    passport.authenticate('jwt', { session: false }),
    // validatorHandler(createProductSchema, 'body'),
    async (req, res, next) => {
        const { customer_sub } = req.user;
        const { productId } = req.params;
        const body = {
            productId,
            productAmount: 1,
            customerId: customer_sub,
        };

        try {
            await service.createItemForCart(body);
            const currentCart = await service.findItemsByCustomerId(customer_sub);
            res.status(201).json(currentCart);
        }
        catch (err){
            next(err);
        }
    }
);

router.patch('/:productId',
    passport.authenticate('jwt', { session: false }),
    // validatorHandler(createProductSchema, 'body'),
    async (req, res, next) => {
        const { customer_sub } = req.user;
        const { productId } = req.params;
        const body = req.body;
        body.customerId = customer_sub;
        body.productId = productId;

        try {
            await service.updateAmoutOfItem(body);
            const currentCart = await service.findItemsByCustomerId(customer_sub);
            res.status(200).json(currentCart);
        }
        catch (err){
            next(err);
        }
    }
);

router.delete('/:productId',
    passport.authenticate('jwt', { session: false }),
    // validatorHandler(productIdSchema, 'params'),
    async (req, res, next) => {
        const { customer_sub } = req.user;
        const { productId } = req.params;
        try {
            await service.deleteItemFromCart(customer_sub, productId);
            const currentCart = await service.findItemsByCustomerId(customer_sub);
            res.status(200).json(currentCart);
        }
        catch (err){
            next(err);
        }
    }
);

module.exports = router;