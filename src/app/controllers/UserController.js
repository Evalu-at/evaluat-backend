const UserRepository = require("../repositories/UserRepository");
const bcrypt = require('bcrypt');

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

    async checkValidLogin(response, email) {
        try{

            const userMatch = await UserRepository.findEmail(email);

            if(!userMatch)
                return response.status(401).json({ error: 'Authentication Failed' });
            
            const password = await UserRepository.findPassword(email);
            
            const passwordMatch = await bcrypt.compare(password, UserRepository.password);
            
            if(!passwordMatch)
                return response.status(401).json({ error: 'Authentication Failed' });

            /* const token = jwt.sign({ UserId: user.id }, 'your-secret-key', { expiresIn: '1h', }); 
            response.status(200).json({ token }); Att. Mateus */

            response.status(200).json({ success: 'Login success' })
            
        }catch(e){
            response.status(500).json({ error: "Login failed" });
        }
    }
}

module.exports = new UserController();
