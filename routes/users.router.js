const router = require('express').Router();
const validatorHandler = require('../middlewares/validate.handler');
const { userIdSchema, userInfoSchema, patchUserSchema } = require('../schemas/user.schema');
const UsersService = require('../services/users.services');
const service = new UsersService();
// const boom = require('@hapi/boom');

router.get('/',
    async (req, res, next) => {
        const { size, offset } = req.query;

        try {
            let result = await service.returnUsers();

            if (offset){
                result = result.slice(parseInt(offset));
            }
            if (size){
                result = result.slice(0, parseInt(size));
            }

            res.status(200).json(result);
        }
        catch (err){
            next(err);
        }
    }
);

router.get('/:id',
    validatorHandler(userIdSchema, 'params'),
    async (req, res, next) => {
        const { id } = req.params;

        try {
            let result = await service.findUserById(id);

            res.status(200).json(result);
        }
        catch (err){
            next(err);
        }
    }
);

router.post('/',
    validatorHandler(userInfoSchema, 'body'),
    async (req, res, next) => {
        const body = req.body;

        try {
            const result = await service.createUser(body);

            res.status(201).json({
                data: result,
            });
        }
        catch (err){
            next(err);
        }
    }
);

router.put('/:id',
    validatorHandler(userIdSchema, 'params'),
    validatorHandler(userInfoSchema, 'body'),
    async (req, res, next) => {
        const body = req.body;
        const { id } = req.params;

        try {
            const result = await service.updateUser(id, body);

            res.status(200).json({
                data: result,
            });
        }
        catch (err){
            next(err);
        }
    }
);

router.patch('/:id',
    validatorHandler(userIdSchema, 'params'),
    validatorHandler(patchUserSchema, 'body'),
    async (req, res, next) => {
        const body = req.body;
        const { id } = req.params;

        try {
            const result = await service.updateUser(id, body);

            res.status(200).json({
                data: result,
            });
        }
        catch (err){
            next(err);
        }
    }
);

router.delete('/:id',
    validatorHandler(userIdSchema, 'params'),
    async (req, res, next) => {
        const { id } = req.params;

        try {
            const result = await service.deleteUser(id);

            res.status(200).json({
                data: result,
            });
        }
        catch (err){
            next(err);
        }
    }
);

module.exports = router;