const { comparePassword, encryptPassword } = require('../utils/encrypt');
const UsersService = require('./users.services');
const service = new UsersService();
const nodemailer = require("nodemailer");
const jwt = require('jsonwebtoken');
const boom = require('@hapi/boom');

class AuthService {
    async findExistingUser(email, password) {
        const user = await service.findUserByEmail(email);
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
        const user = await service.findUserByEmail(email);

        if (!user) {
            throw boom.unauthorized();
        }

        const payload = { sub: user.id };
        const token = jwt.sign(payload, process.env.JWT_RECOVERY_SECRET, {
            expiresIn: '15min',
        });

        const link = `https://myfrontend.com/recovery?token=${token}`;
        await service.updateUser(user.id, { recoveryToken: token });

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
            html: `<div><p>Recover your account with this link:</p><a href='${link}'>${link}</a></div>`,
        });

        return { message: 'Email sent correctly' };
    }

    async confirmRecovery(token, newPassword) {
        const payload = jwt.verify(token, process.env.JWT_RECOVERY_SECRET);

        const user = await service.findUserById(payload.sub);

        if (user.recoveryToken !== token) {
            throw boom.unauthorized();
        }

        const hash = await encryptPassword(newPassword);
        await service.updateUser(user.id, { recoveryToken: null, password: hash });

        return { message: 'Password changed successfully' };
    }
}


module.exports = AuthService;