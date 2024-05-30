const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const UserRepository = require('../repositories/UserRepository')
const speakeasy = require('speakeasy')
const nodemailer = require('nodemailer')
require('dotenv').config()

class UserController {
    constructor() {
        this.secret
    }

    async show(request, response) {
        /*
            #swagger.tags = ['user']
            #swagger.summary = 'Returns a user by email'
        */
        const { email } = request.body

        /*  #swagger.requestBody = {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#/components/schemas/userIdBody'
                        }
                    }
                }
            }
        */

        const users = await UserRepository.findEmail(email)

        if (!users) {
            return response.status(404).json({ error: 'User not found' })
        }

        response.json(users)
    }

    async add(request, response) {
        /*
            #swagger.tags = ['user']
            #swagger.summary = 'Create a new user'
        */

        try {
            const { email, nome, senha, cargo } = request.body
            /*  #swagger.requestBody = {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/userAddBody'
                            }
                        }
                    }
                }
            */

            const userExists = await UserRepository.findEmail(email)

            if (userExists) {
                return response
                    .status(400)
                    .json({ error: 'This email already in use' })
            }

            // cargo { coordenador OU aluno }
            await UserRepository.createUser(email, nome, senha, cargo)

            return response.status(200).json({ success: 'Signup success' })
        } catch (e) {
            return response.status(500).json({ error: 'Signup failed' })
        }
    }

    async findRole(request, response) {
        try {
            const { email } = request.body

            const userRole = await UserRepository.findRole(email)

            response.json(userRole)
        } catch (e) {
            response.status(500).json({ error: 'Search Failed' })
        }
    }

    async checkValidLogin(request, response) {
        /*
            #swagger.tags = ['user']
            #swagger.summary = 'Login an existent user'
        */

        const { email, senha } = request.body
        /*  #swagger.requestBody = {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/userLoginBody'
                            }
                        }
                    }
                }
            */

        try {
            const userMatch = await UserRepository.findEmail(email)

            if (!userMatch)
                return response
                    .status(401)
                    .json({ error: 'Authentication Failed' })

            const password = await UserRepository.findPassword(email)

            const passwordMatch = await bcrypt.compare(
                String(senha),
                String(password)
            )
            if (!passwordMatch)
                return response
                    .status(401)
                    .json({ error: 'Authentication Failed' })

            const validEmail = await UserRepository.findVerifiedEmail(email)

            if (!validEmail)
                return response
                    .status(401)
                    .json({ error: 'Authentication Failed' })

            const userUUId = await UserRepository.findId(email)
            const userCargo = await UserRepository.findRoleId(userUUId)

            const token = jwt.sign(
                { userId: userUUId, cargo: userCargo },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN },
            );

            const userRole = await UserRepository.findRole(email);

            // Verificar tags de seguranca dos cookies!
            return response
                .status(200)
                .cookie('access_token', token)
                .json({ success: 'Login success', role: userRole});
        } catch (e) {
            response.status(500).json({ error: 'Login failed' })
        }
    }

    async formulario(request, response) {
        /*
            #swagger.tags = ['adm']
            #swagger.summary = 'Endpoint in test'
        */
        return response
            .status(200)
            .json({ message: 'testando authorizacao de acesso ao formulario' })
    }

    async sendEmail(request, response) {
        /*
            #swagger.tags = ['adm']
            #swagger.summary = 'Endpoint in test'
        */
        const { email } = request.body

        UserController.secret = speakeasy.generateSecret({ length: 20 })

        const totpCode = speakeasy.totp({
            secret: UserController.secret.base32,
            encoding: 'base32',
            digits: 6,
            time: 120,
        })

        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            host: 'smtp.gmail.com',
            port: 25,
            secure: true,
            auth: {
                user: process.env.SENDER_EMAIL,
                pass: process.env.SENDER_PASS,
            },
        })

        const mail_data = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: 'Codigo de Verificacao de Email - Evalu.At',
            text: totpCode,
        }

        transporter.sendMail(mail_data, (err, info) => {
            if (err) {
                console.log(err)
                return response.sendStatus(500)
            }
            response.status(200).send({
                message: 'Email Sent',
                message_id: info.messageId,
            })
            return next()
        })
    }

    async verifyEmail(request, response) {
        /*
            #swagger.tags = ['user']
            #swagger.summary = 'Logout the loged user'
        */

        const { email, userTotpInput } = request.body

        const verifiedTotp = speakeasy.totp.verify({
            secret: UserController.secret.base32,
            encoding: 'base32',
            token: userTotpInput,
            time: 120,
        })

        if (!verifiedTotp) return response.sendStatus(402)

        UserRepository.updateVerifiedEmail(email)

        return response.sendStatus(200)
    }

    async validationCheck(request, response) {
        response.status(200).json({ success: request })
    }

    async logOut(response) {
        /*
            #swagger.tags = ['user']
            #swagger.summary = 'Logout the loged user'
        */

        return response
            .clearCookie('access_token')
            .status(200)
            .json({ success: 'Logout Success' })
    }
}

module.exports = new UserController()
