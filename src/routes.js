const { Router } = require('express');
const cookieParser = require('cookie-parser');

const UserController = require('./app/controllers/UserController');
const Middleware = require('./app/middlewares/Middleware');

const router = Router();

router.use(cookieParser());

router.get('/', (req, res) => {
  res.send('Hello World from Evalu.at!');
});

router.get('/user/id', UserController.show);
router.post('/user/add', Middleware.email_verification, UserController.add);
router.post('/user/login', UserController.checkValidLogin);
router.get('/user/logout', Middleware.authorization, UserController.logOut);

router.get('/formulario', Middleware.authorization, UserController.formulario);

module.exports = router;
