const router = require('express').Router();
const { validatorHandler } = require('../middlewares/validate.handler');
const { userIdSchema, patchUserSchema } = require('../schemas/user.schema');
const UsersService = require('../services/users.services');
const service = new UsersService();
const boom = require('@hapi/boom');

router.get('/',
    (req, res, next) => {
        const message = 'It is only permited for admin users';

        next(boom.locked(message));
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
    (req, res, next) => {
        const message = 'It is only permited to generate new users by "customers" URL';

        next(boom.locked(message));
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

            res.status(200).json(result);
        }
        catch (err){
            next(err);
        }
    }
);

router.delete('/',
    (req, res, next) => {
        const message = 'It is only permited for admin users';

        next(boom.locked(message));
    }
);

module.exports = router;