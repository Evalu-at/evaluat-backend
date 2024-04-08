const { Router } = require('express');
const cookieParser = require('cookie-parser');

const UserController = require('./app/controllers/UserController');

const router = Router();

router.use(cookieParser());

// Validar se esse lugar para o metodo de authorization realmente esta correto ou nao.
const authorization = (request, response, next) => {
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

router.get('/', (req, res) => {
  res.send('Hello World from Evalu.at!');
});

router.get('/user/:id', UserController.show);
router.post('/user', UserController.add);
router.get('/logout', authorization, UserController.logOut);
router.get('/formulario', authorization, UserController.formulario);

module.exports = router;
