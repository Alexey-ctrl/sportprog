const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'notverer10@gmail.com',
        pass: 'aolsqlxxdsahiqhr',
    }
});

module.exports = transporter;
