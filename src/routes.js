const { Router } = require('express')
const cookieParser = require('cookie-parser')

const ClassController = require('./app/controllers/ClassController')
const UserController = require('./app/controllers/UserController')
const Middleware = require('./app/middlewares/Middleware')

const router = Router()

router.use(cookieParser())

router.get('/', (req, res) => {
    res.send('Hello World from Evalu.at!')
})

router.get(
    '/validate-jwt',
    Middleware.authorization,
    UserController.validationCheck
)

router.get('/user/id', UserController.show)
router.get('/user/logout', Middleware.authorization, UserController.logOut)
router.post('/user/add', UserController.add)
router.post('/user/login', UserController.checkValidLogin)
router.post('/user/get_feelings', ClassController.getFeelings)
router.post('/user/send-otp', UserController.sendEmail)
router.post('/user/verify', UserController.verifyEmail)

router.post('/classroom/add-student', ClassController.addStudent)
router.post('/classroom/remove-student', ClassController.removeStudent)
router.post('/classroom/create-evaluation', ClassController.createEvaluation)
router.post('/classroom/set-student-evaluation', ClassController.setEvaluation)
router.post('/classroom/delete', ClassController.deleteClass)
router.post('/classroom/add', ClassController.addClass)

router.get('/find/user-role', UserController.findRole)

router.get(
    '/formulario',
    Middleware.authorization,
    Middleware.email_verification,
    UserController.formulario
)

module.exports = router
