const { Router } = require('express');
const cookieParser = require('cookie-parser');

const UserController = require('./app/controllers/UserController');
const Middleware = require('./app/middlewares/Middleware');

const router = Router();

router.use(cookieParser());

// Validar se esse lugar para o metodo de authorization realmente esta correto ou nao.
/* const authorization = (request, response, next) => {
    const token = request.cookies.access_token;
    if (!token) { return response.sendStatus(403) }
    try {
        const data = jwt.verify(token, process.env.JWT_SECRET);
        request.userId = data.userId;
        return next();
    } catch {
        return response.sendStatus(403);
    }
} */

router.get('/', (req, res) => {
  res.send('Hello World from Evalu.at!');
});

router.get('/user/id', UserController.show);
router.post('/user/add', UserController.add);
router.post('/user/login', UserController.checkValidLogin);
router.get('/user/logout', Middleware.authorization, UserController.logOut);

router.get('/formulario', Middleware.authorization, UserController.formulario);

module.exports = router;
