const { comparePassword, encryptPassword } = require('../utils/encrypt');
const UsersService = require('./users.services');
const userService = new UsersService();
const jwt = require('jsonwebtoken');
const boom = require('@hapi/boom');
const sendEmail = require('../utils/send_email');
const fs = require('fs');
const path = require('path');

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

        const svg = fs.readFileSync(path.resolve(__dirname, '../public/assets/yardsale.svg'), 'utf-8');

        const emailConfig = {
            to: email,
            subject: 'Recover your password - YardSale',
            html: `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta http-equiv="X-UA-Compatible" content="IE=edge">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                </head>
                <body>
                    <main style="padding: 45px 0px; text-align: center; font-weight: bold; font-family: sans-serif; background-color: #ffffff">
                        ${svg}
                        <p style="margin: 0px; font-size: 24px">
                            <span>Hello</span>
                            <span style="text-transform: capitalize;">${user.firstName}</span>
                        </p>
                        <p style="padding-bottom: 32px; color: #7b7b7b">
                            A request has been received to change the password for your YardSale account.
                        </p>
                        <a style="padding: 14px 20px; border-radius: 6px; color: white; text-decoration: none; background-color: #ACD9B2" href='${link}'>
                            Reset Password
                        </a>
                    </main>
                    </body>
                </html>
            `,
        }

        sendEmail(emailConfig);

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