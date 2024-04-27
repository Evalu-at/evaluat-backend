const UserRepository = require('../repositories/UserRepository');
const UserController = require('../controllers/UserController');
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
        const verifiedEmail = UserRepository.findVerifiedEmail;

        if(!verifiedEmail)
            return response.status(401).send({ message: 'Email não é verificado, por favor verificar', message_id: info.messageId });

        return next();
    }
}

module.exports = new Middleware()
