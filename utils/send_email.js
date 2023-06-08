const nodemailer = require("nodemailer");

async function sendEmail(metaOpts = {}) {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.NODEMAILER_MAIL,
            pass: process.env.NODEMAILER_PASSWORD,
        },
    });

    await transporter.sendMail(metaOpts);
}

module.exports = sendEmail;