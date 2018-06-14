const nodemailer = require('nodemailer');

//Transporter for sending a mail
const mailTransporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD
    }
});

module.exports = mailTransporter;