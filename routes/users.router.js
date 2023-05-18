const router = require('express').Router();
const { validatorHandler } = require('../middlewares/validate.handler');
const { patchUserSchema } = require('../schemas/user.schema');
const UsersService = require('../services/users.services');
const jwt = require('jsonwebtoken');
const service = new UsersService();
const boom = require('@hapi/boom');

router.get('/',
    (req, res, next) => {
        const message = 'It is only permited for admin users';

        next(boom.locked(message));
    }
);

// router.get('/:id',
//     validatorHandler(userIdSchema, 'params'),
//     async (req, res, next) => {
//         const { id } = req.params;

//         try {
//             let result = await service.findUserById(id);

//             res.status(200).json(result);
//         }
//         catch (err){
//             next(err);
//         }
//     }
// );

router.get('/info',
    async (req, res, next) => {
        const cookieToken = req.cookies.session;
        try {
            const token = jwt.verify(cookieToken, process.env.JWT_LOGIN_SECRET);

            let result = await service.findUserById(token.sub);
            res.status(200).json(result);
        }
        catch (err){
            next(boom.unauthorized('Introduce a valid token or refresh your session.'));
        }
    }
);

router.post('/',
    (req, res, next) => {
        const message = 'It is only permited to generate new users by "customers" URL';

        next(boom.locked(message));
    }
);

router.patch('/',
    validatorHandler(patchUserSchema, 'body'),
    async (req, res, next) => {
        const body = req.body;
        const cookieToken = req.cookies.session;

        try {
            const token = jwt.verify(cookieToken, process.env.JWT_LOGIN_SECRET);
            const result = await service.updateUser(token.sub, body);

            res.status(200).json(result);
        }
        catch (err){
            next(boom.unauthorized('Introduce a valid token or refresh your session.'));
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