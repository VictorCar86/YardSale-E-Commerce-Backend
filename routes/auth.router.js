const router = require('express').Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const AuthService = require('../services/auth.services');
const { validatorHandler } = require('../middlewares/validate.handler');
const { patchUserPassSchema } = require('../schemas/user.schema');
const service = new AuthService();

router.post('/login',
    passport.authenticate('local', { session: false }),
    (req, res, next) => {
        try {
            const user = req.user;
            const payload = { sub: user.id, role: user.role, customer_sub: user.customer.id };
            const token = jwt.sign(payload, process.env.JWT_LOGIN_SECRET, { expiresIn: '1h' });

            res.status(200).cookie('session', token, {
                // domain: 'http://127.0.0.1:5173/',
                // path: '/login',
                httpOnly: true,
                sameSite: 'none',
                secure: true,
                expires: new Date(Date.now() + (60000 * 60)),
            }).json('Session created.');
        }
        catch (err){
            next(err);
        }
    }
);

router.post('/signout',
    passport.authenticate('jwt', { session: false }),
    (req, res, /*next*/) => {
        res.status(200)
            .clearCookie('session')
            .json('Cookie session deleted.');
    }
);

// router.get('/session-status',
//     (req, res, /*next*/) => {
//         const session = req.cookies.session;
//         // console.log("🚀 ~ file: auth.router.js:35 ~ session:", session);

//         if (session){
//             res.status(201).json(session);
//         } else {
//             res.status(501).json('Login session not found.');
//         }
//     }
// );

router.post('/recovery',
    async (req, res, next) => {
        try {
            const { email } = req.body;

            const result = await service.sendMailToRecover(email);

            res.status(201).json(result);
        }
        catch (error) {
            next(error);
        }
    }
);

router.post('/new-password',
    validatorHandler(patchUserPassSchema, 'body'),
    async (req, res, next) => {
        try {
            const { token, newPassword } = req.body;
            const updatedUser = await service.confirmRecovery(token, newPassword);

            const payload = { sub: updatedUser.id, role: updatedUser.role, };
            const sessionToken = jwt.sign(payload, process.env.JWT_LOGIN_SECRET, { expiresIn: '1h' });

            res.status(200).cookie('session', sessionToken, {
                httpOnly: true,
                sameSite: 'none',
                secure: true,
                expires: new Date(Date.now() + (60000 * 60)),
            }).json('Session created.');
        }
        catch (error) {
            next(error);
        }
    }
);

module.exports = router;