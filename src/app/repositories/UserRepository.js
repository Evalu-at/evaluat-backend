const db = require("../../database");
const bcrypt = require("bcrypt");

class UserRepository {
    async findEmail(email) {
        const query = {
            name: "fetch-email",
            text: "SELECT * FROM usuario WHERE email = $1",
            values: [email],
        };

        const rows = await db.query(query);

        return rows;
    }

    async createUser({ id, email, nome, senha }) {
        const hashPass = await bcrypt.hash(senha, 10);

        const query = {
            name: "create-user",
            text: "INSERT INTO usuario(id, email, nome, senha) \
            VALUES($1, $2, $3, $4)",
            values: [id, email, nome, hashPass],
        };

        const rows = await db.query(query);

        return rows;
    }
}

module.exports = new UserRepository();
