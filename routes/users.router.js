const router = require('express').Router();
const { validatorHandler, adminCheckHandler } = require('../middlewares/validate.handler');
const { patchUserSchema, userIdSchema } = require('../schemas/user.schema');
const UsersService = require('../services/users.services');
const service = new UsersService();
const boom = require('@hapi/boom');
const passport = require('passport');

router.get('/',
    passport.authenticate('jwt', { session: false }),
    adminCheckHandler(),
    async (req, res, next) => {
        try {
            const result = await service.returnUsers();
            res.status(200).json(result);
        }
        catch (err) {
            next(err);
        }
    }
);

router.get('/info',
    passport.authenticate('jwt', { session: false }),
    async (req, res, next) => {
        const { sub } = req.user;
        try {
            let result = await service.findUserById(sub);
            res.status(200).json(result);
        }
        catch (err){
            next(boom.unauthorized('Introduce a valid token or refresh your session.'));
        }
    }
);

router.get('/:id',
    passport.authenticate('jwt', { session: false }),
    validatorHandler(userIdSchema, 'params'),
    async (req, res, next) => {
        const { id } = req.params;
        try {
            const result = await service.findUserById(id);
            res.status(200).json(result);
        }
        catch (err){
            next(err);
        }
    }
);

// router.post('/',
//     (req, res, next) => {
//         const message = 'It is only permited to generate new users by "customers" URL';
//         next(boom.locked(message));
//     }
// );

router.patch('/',
    passport.authenticate('jwt', { session: false }),
    validatorHandler(patchUserSchema, 'body'),
    async (req, res, next) => {
        const body = req.body;
        const { sub } = req.user;
        try {
            const result = await service.updateUser(sub, body);
            res.status(200).json(result);
        }
        catch (err){
            next(boom.unauthorized('Introduce a valid token or refresh your session.'));
        }
    }
);

// router.delete('/',
//     (req, res, next) => {
//         const message = 'It is only permited for admin users';

//         next(boom.locked(message));
//     }
// );

module.exports = router;