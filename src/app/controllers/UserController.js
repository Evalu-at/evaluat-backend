const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserRepository = require("../repositories/UserRepository");

class UserController {
    async show(request, response) {
        const { email } = request.body;
        const users = await UserRepository.findEmail(email);

        if (!users[0].exists) {
            return response.status(404).json({ error: "User not found" });
        }

        response.json(users);
    }

    async add(request, response) {
        try {
            const { email, nome, senha } = request.body;

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
        const { email, senha } = request.body;

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

            // Apesar de nao achar que deve ser usado o userMatch aqui como UserID, coloquei
            // temporariamente pois nao sabia onde pegar o ID.
            //const token = jwt.sign({ userId: userMatch }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

            // Verificar tags de seguranca dos cookies
            //response.status(200).cookie('access_token', token, { httpOnly: true }).json({ success: 'Login success' });

            return response.json({ success: "Login success" });
        } catch (e) {
            response.status(500).json({ error: "Login failed" });
        }
    }

    async formulario(request, response) {
        return response
            .status(200)
            .json({ message: "testando authorizacao de acesso ao formulario" });
    }

    async logOut(request, response) {
        return response
            .clearCookie("access_token")
            .status(200)
            .json({ success: "Logout success" });
    }
}

module.exports = new UserController();
