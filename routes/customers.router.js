const router = require('express').Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const { validatorHandler, adminCheckHandler } = require('../middlewares/validate.handler');
const { customerIdSchema, customerInfoSchema, /*patchCustomerSchema*/ } = require('../schemas/customer.schema');
const CustomersService = require('../services/customer.services');
const service = new CustomersService();
// const boom = require('@hapi/boom');

router.get('/',
    passport.authenticate('jwt', { session: false }),
    adminCheckHandler(),
    async (req, res, next) => {
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
    adminCheckHandler(),
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
            const user = customer.user;
            const payload = { sub: user.id, role: user.role, customer_sub: customer.id };
            const token = jwt.sign(payload, process.env.JWT_LOGIN_SECRET, { expiresIn: '1h' });

            res.status(200).cookie('session', token, {
                httpOnly: true,
                sameSite: 'none',
                secure: true,
                expires: new Date(new Date().getTime() + (60000 * 10)),
            }).json('Session created');
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

router.delete('/',
    passport.authenticate('jwt', { session: false }),
    validatorHandler(customerIdSchema, 'params'),
    async (req, res, next) => {
        const { customer_sub } = req.params;
        try {
            const result = await service.deleteCustomer(customer_sub);
            res.status(200).json(result);
        }
        catch (err){
            next(err);
        }
    }
);

module.exports = router;