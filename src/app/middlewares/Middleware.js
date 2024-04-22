const nodemailer =  require('nodemailer');
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
            text: '458 675' // Colocar numero gerado aleatoriamente
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
