const UserRepository = require("../repositories/UserRepository");

class UserController {
    async show(request, response) {
        const { email } = request.params;
        const users = await UserRepository.findEmail(email);

        if (!users) {
            return response.status(404).json({ error: "User not found" });
        }

        response.json(users);
    }

    async add(request, response) {
        const { id, email, nome, senha } = request.body;

        if (!id) {
            return response.status(400).json({ error: "Id is required" });
        }

        const userExists = await UserRepository.findEmail(email);

        if (userExists.length !== 0) {
            console.log(email)
            return response
                .status(400)
                .json({ error: "This email already in use" });
        }

        const create = await UserRepository.createUser({
            id,
            email,
            nome,
            senha,
        });

        response.json(create);
    }
}

module.exports = new UserController();
