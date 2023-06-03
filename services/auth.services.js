const { comparePassword, encryptPassword } = require('../utils/encrypt');
const UsersService = require('./users.services');
const userService = new UsersService();
const nodemailer = require("nodemailer");
const jwt = require('jsonwebtoken');
const boom = require('@hapi/boom');

class AuthService {
    async findExistingUser(email, password) {
        const user = await userService.findUserByEmail(email);
        const errMessage = 'The email or password provided is incorrect';

        if (user === null){
            throw boom.badRequest(errMessage);
        }

        const isMatch = await comparePassword(password, user.password);

        if (!isMatch){
            throw boom.badRequest(errMessage);
        }

        delete user.dataValues.password;
        return user;
    }

    async sendMailToRecover(email) {
        const user = await userService.findUserByEmail(email);

        if (!user) {
            throw boom.unauthorized();
        }

        const payload = { sub: user.id };
        const token = jwt.sign(payload, process.env.JWT_RECOVERY_SECRET, {
            expiresIn: '15min',
        });

        const link = `${process.env.FRONTEND_URL}/success-recover?token=${token}`;
        await userService.updateUser(user.id, { recoveryToken: token });

        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.NODEMAILER_MAIL,
                pass: process.env.NODEMAILER_PASSWORD,
            },
        });

        await transporter.sendMail({
            to: email,
            subject: 'Nodemailer Test 👋',
            html: `<div><p>Recover your account with this link:</p><a href='${link}'>Recover Password</a></div>`,
        });

        return { message: 'Email sent correctly' };
    }

    async confirmRecovery(token, newPassword) {
        try {
            const payload = jwt.verify(token, process.env.JWT_RECOVERY_SECRET);
            const recoveryToken = await userService.findRecoveryTokenById(payload.sub);

            if (recoveryToken !== token) {
                throw boom.unauthorized('The introduced token has expired.');
            }

            const hash = await encryptPassword(newPassword);
            const updatedUser = await userService.updateUser(payload.sub, { recoveryToken: null, password: hash });

            return { id: payload.sub, ...updatedUser };
        }
        catch (err) {
            throw boom.badRequest('Invalid token.');
        }
    }
}


module.exports = AuthService;