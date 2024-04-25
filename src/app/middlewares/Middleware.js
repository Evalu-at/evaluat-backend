const nodemailer =  require('nodemailer');
const speakeasy = require('speakeasy');
require('dotenv').config();

class Middleware{
    authorization = (request, response, next) => {
        const token = request.cookies.access_token;
        if (!token) { return response.sendStatus(403) }
        try {
            const data = jwt.verify(token, process.env.JWT_SECRET);
            request.userId = data.userId;
            return next();
        } catch {
            return response.sendStatus(403);
        }
    }

    email_verification = (request, response, next) => {
        const secret = speakeasy.generateSecret({ length: 20 });

        const otpCode = speakeasy.totp({
            secret: secret.base32,
            encoding: 'base32',
            digits: 6,
            time: 60
          });

          const verifiedTotp = speakeasy.totp.verify({
            secret: secret.base32,
            encoding: 'base32',
            token: otpCode,
            time: 60
        });

        if(!verifiedTotp)
            return response.sendStatus(403);

        const { email } = request.body;
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.SENDER_EMAIL,
                pass: process.env.SENDER_PASS
            },
        })

        const mail_data = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: 'Codigo de Verificacao de Email - Evalu.At',
            text: otpCode
        }

        transporter.sendMail(mail_data, (err, info) => {
            if (err) {
                console.log(err);
                return response.sendStatus(500);
            }
            response.status(200).send({ message: 'Email enviado!', message_id: info.messageId });
            return next();
        })
    }
}

module.exports = new Middleware()
