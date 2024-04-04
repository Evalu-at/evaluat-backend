const { Router } = require('express');

const UserController = require('./app/controllers/UserController');

const router = Router();

router.get('/', (req, res) => {
  res.send('Hello World from Evalu.at!');
});

router.get('/user/:id', UserController.show);
router.post('/user', UserController.add);

module.exports = router;
