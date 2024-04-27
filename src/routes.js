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
router.post('/user/add', UserController.add);
router.post('/user/add/classroom', UserController.addClass);
router.post('/user/login', UserController.checkValidLogin);
router.get('/user/logout', Middleware.authorization, UserController.logOut);
router.post('/user/delete/classroom', UserController.deleteClass);

router.get('/formulario', Middleware.authorization, UserController.formulario);

// Test routes
router.get('/roleTest', UserController.findRole);

module.exports = router;
