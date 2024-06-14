const { Router } = require('express');
const cookieParser = require('cookie-parser');

const ClassController = require('./app/controllers/ClassController')
const UserController = require('./app/controllers/UserController');
const Middleware = require('./app/middlewares/Middleware');

const router = Router();

router.use(cookieParser());

router.get('/', (req, res) => {
  res.send('Hello World from Evalu.at!');
});

router.get('/user/id', UserController.show);
router.post('/user/add', UserController.add);
router.post('/user/login', UserController.checkValidLogin);
router.post('/user/get_feelings', ClassController.getFeelings);
router.get('/user/verify', UserController.sendEmail); // Envio do email
router.post('/user/verify', UserController.verifyEmail); // Verificar email
router.get('/user/logout', Middleware.authorization, UserController.logOut);

router.post('/classroom/add-student', ClassController.addStudent);
router.post('/classroom/add-professor', ClassController.addProfessor); // Ajustar querie para ver se professor já está na turma
router.post('/classroom/remove-student', ClassController.removeStudent);
router.post('/classroom/delete', ClassController.deleteClass);
router.post('/classroom/add', ClassController.addClass);
router.get('/classroom/info', ClassController.classInfo);
router.get('/classroom/general-insights', ClassController.getGeneralInishgts);

router.get('/formulario', Middleware.authorization, Middleware.email_verification, UserController.formulario);

// Test routes
router.post('/create-teacher', ClassController.createTeacher);
router.get('/roleTest', UserController.findRole);
router.post('/evaluateTest', ClassController.createEvaluation);
router.post('/classroom/student-evaluation', ClassController.setEvaluation);

module.exports = router;
