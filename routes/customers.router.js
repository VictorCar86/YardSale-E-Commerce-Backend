const router = require('express').Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const { validatorHandler } = require('../middlewares/validate.handler');
const { customerIdSchema, customerInfoSchema, /*patchCustomerSchema*/ } = require('../schemas/customer.schema');
const CustomersService = require('../services/customer.services');
const service = new CustomersService();
// const boom = require('@hapi/boom');

router.get('/',
    async (req, res, next) => {
        // const { size, offset } = req.query;

        try {
            let result = await service.returnCustomers();

            res.status(200).json(result);
        }
        catch (err){
            next(err);
        }
    }
);

router.get('/:id',
    passport.authenticate('jwt', { session: false }),
    validatorHandler(customerIdSchema, 'params'),
    async (req, res, next) => {
        const { id } = req.params;

        try {
            let result = await service.findCustomerById(id);

            res.status(200).json(result);
        }
        catch (err){
            next(err);
        }
    }
);

router.post('/',
    validatorHandler(customerInfoSchema, 'body'),
    async (req, res, next) => {
        const body = req.body;

        try {
            const customer = await service.createCustomer(body);
            // console.log("🚀 ~ file: customers.router.js:49 ~ customer:", customer.user)

            const payload = {
                sub: customer.user.id,
                role: customer.user.role,
                email: customer.user.email
            };

            const token = jwt.sign(payload, process.env.JWT_LOGIN_SECRET);

            res.status(201).json(token);
        }
        catch (err){
            next(err);
        }
    }
);

// router.patch('/:id',
//     validatorHandler(customerIdSchema, 'params'),
//     validatorHandler(patchCustomerSchema, 'body'),
//     async (req, res, next) => {
//         const body = req.body;
//         const { id } = req.params;

//         try {
//             const result = await service.updateUser(id, body);

//             res.status(200).json(result);
//         }
//         catch (err){
//             next(err);
//         }
//     }
// );

router.delete('/:id',
    validatorHandler(customerIdSchema, 'params'),
    async (req, res, next) => {
        const { id } = req.params;

        try {
            const result = await service.deleteCustomer(id);

            res.status(200).json(result);
        }
        catch (err){
            next(err);
        }
    }
);

module.exports = router;