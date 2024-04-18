const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserRepository = require("../repositories/UserRepository");
require('dotenv').config();

class UserController {

    async show(request, response) {
        /*
            #swagger.tags = ['user']
            #swagger.summary = 'Returns a user by email'
        */
        const { email } = request.body;

        /*  #swagger.requestBody = {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/userIdBody"
                        }
                    }
                }
            }
        */

        const users = await UserRepository.findEmail(email);

        if (!users[0].exists) {
            return response.status(404).json({ error: "User not found" });
        }

        response.json(users);
    }

    async add(request, response) {
        /*
            #swagger.tags = ['user']
            #swagger.summary = 'Create a new user'
        */

        try {
            const { email, nome, senha } = request.body;
            /*  #swagger.requestBody = {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/userAddBody"
                            }
                        }
                    }
                }
            */

            const userExists = await UserRepository.findEmail(email);

            if (userExists[0].exists) {
                return response
                    .status(400)
                    .json({ error: "This email already in use" });
            }

            await UserRepository.createUser({
                email,
                nome,
                senha,
            });

            response.status(200).json({ success: "Signup success" });
        } catch (e) {
            response.status(500).json({ error: "Signup failed" });
        }
    }

    async checkValidLogin(request, response) {
        /*
            #swagger.tags = ['user']
            #swagger.summary = 'Login an existent user'
        */

        const { email, senha } = request.body;
            /*  #swagger.requestBody = {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/userLoginBody"
                            }
                        }
                    }
                }
            */

        try {
            const userMatch = await UserRepository.findEmail(email);

            if (!userMatch[0].exists)
            return response
                .status(401)
                .json({ error: "Authentication Failed" });

            const password = await UserRepository.findPassword(email);

            const passwordMatch = await bcrypt.compare(
                String(senha),
                String(password[0].senha),
            );
            if (!passwordMatch)
                return response
                    .status(401)
                    .json({ error: "Authentication Failed" });

            const userUUId = await UserRepository.findId(email);

            const token = jwt.sign({ userId: userUUId }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

            console.log(token);
            // Verificar tags de seguranca dos cookies!
            return response.status(200).cookie('access_token', token).json({ success: 'Login success' });
        } catch (e) {
            response.status(500).json({ error: "Login failed" });
        }
    }

    async formulario(request, response) {
        /*
            #swagger.tags = ['adm']
            #swagger.summary = 'Endpoint in test'
        */
        return response
            .status(200)
            .json({ message: "testando authorizacao de acesso ao formulario" });
    }

    async logOut(request, response) {
        /*
            #swagger.tags = ['user']
            #swagger.summary = 'Logout the loged user'
        */

        return response
            .clearCookie("access_token")
            .status(200)
            .json({ success: "Logout success" });
    }
}

module.exports = new UserController();
