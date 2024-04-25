const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserRepository = require("../repositories/UserRepository");
require("dotenv").config();

class UserController {
    async show(request, response) {
        const { email } = request.body;

        const users = await UserRepository.findEmail(email);

        if (!users) {
            return response.status(404).json({ error: "User not found" });
        }

        response.json(users);
    }

    async add(request, response) {

        try {
            const { email, nome, senha } = request.body;

            const userExists = await UserRepository.findEmail(email);

            if (userExists) {
                return response
                    .status(400)
                    .json({ error: "This email already in use" });
            }

            // cargo { coordenador OU aluno }
            await UserRepository.createUser({
                email,
                nome,
                senha,
                cargo,
            });

            response.status(200).json({ success: "Signup success" });
        } catch (e) {
            response.status(500).json({ error: "Signup failed" });
        }
    }

    async findRole(request, response) {
        try {
            const { email } = request.body;

            const userRole = await UserRepository.findRole(email);

            response.json(userRole);
        } catch (e) {
            response.status(500).json({ error: "Search Failed" });
        }
    }

    async checkValidLogin(request, response) {

        const { email, senha } = request.body;

        try {
            const userMatch = await UserRepository.findEmail(email);

            if (!userMatch)
                return response
                    .status(401)
                    .json({ error: "Authentication Failed" });

            const password = await UserRepository.findPassword(email);

            const passwordMatch = await bcrypt.compare(
                String(senha),
                String(password),
            );
            if (!passwordMatch)
                return response
                    .status(401)
                    .json({ error: "Authentication Failed" });

            const userUUId = await UserRepository.findId(email);

            const token = jwt.sign(
                { userId: userUUId },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN },
            );

            // Verificar tags de seguranca dos cookies!
            return response
                .status(200)
                .cookie("access_token", token)
                .json({ success: "Login success" });
        } catch (e) {
            response.status(500).json({ error: "Login failed" });
        }
    }

    async formulario(response) {
        return response
            .status(200)
            .json({ message: "testando authorizacao de acesso ao formulario" });
    }

    async logOut(response) {

        return response
            .clearCookie("access_token")
            .status(200)
            .json({ success: "Logout success" });
    }
}

module.exports = new UserController();
