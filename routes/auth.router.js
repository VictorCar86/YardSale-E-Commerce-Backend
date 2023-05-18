const router = require('express').Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const boom = require('@hapi/boom');
const AuthService = require('../services/auth.services');
const service = new AuthService();

router.post('/login',
    passport.authenticate('local', { session: false }),
    (req, res, next) => {
        try {
            const user = req.user;
            const payload = { sub: user.id, role: user.role, /*email: user.email*/ };
            const token = jwt.sign(payload, process.env.JWT_LOGIN_SECRET);

            res.status(200).cookie('session', token, {
                // domain: 'http://127.0.0.1:5173/',
                // path: '/login',
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

router.post('/signout',
    (req, res, next) => {
        try {
            const session = req.cookies.session;
            jwt.verify(session, process.env.JWT_LOGIN_SECRET);

            res.status(200).clearCookie('session').json('Cookie session deleted.');
        }
        catch (err){
            next(boom.unauthorized('You do not have an active session yet.'));
        }
    }
);

router.get('/session-status',
    (req, res, /*next*/) => {
        const session = req.cookies.session;
        // console.log("🚀 ~ file: auth.router.js:35 ~ session:", session);

        if (session){
            res.status(201).json(session);
        } else {
            res.status(501).json('Login session not found.');
        }
    }
);

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
    async (req, res, next) => {
        try {
            const { token, newPassword } = req.body;

            const result = await service.confirmRecovery(token, newPassword);

            res.status(201).json(result);
        }
        catch (error) {
            next(error);
        }
    }
);

module.exports = router;