const router = require('express').Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const AuthService = require('../services/auth.services');
const service = new AuthService();

router.post('/login',
    passport.authenticate('local', { session: false }),
    (req, res, next) => {
        try {
            const user = req.user;

            const payload = { sub: user.id, role: user.role };

            const token = jwt.sign(payload, process.env.JWT_LOGIN_SECRET);

            res.status(201).json({ token });
        }
        catch (err){
            next(err);
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