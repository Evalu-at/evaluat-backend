const nodemailer =  require('nodemailer');
const UserRepository = require('../repositories/UserRepository');
/* const permissions = require('../config/roles.json'); // discutir necessidade de uso */

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
            service: 'gmail',
            auth: {
                user: process.env.SENDER_EMAIL,
                pass: process.env.SENDER_PASS // Tem que colocar as chaves do google pra funcionar
            },
        })

        const mail_data = {
            from: 'evaluat2024.1@gmail.com',
            to: email,
            subject: 'Codigo de Verificacao de Email - Evalu.At',
            text: '123 456' // Colocar numero gerado aleatoriamente
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

    checkRole = (request, response, permissionRole, next) => {
        const { email } = request.body;
        const role = UserRepository.findRole(email);

        if (role === permissionRole)
            return next();

        return response.status(403).send({ message: 'User role not authorized' });
    }
}

module.exports = new Middleware()
