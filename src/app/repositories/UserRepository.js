const db = require("../../database");
const bcrypt = require("bcrypt");

class UserRepository {
    async findEmail(email) {
        const query = {
            name: "fetch-email",
            text: "SELECT EXISTS (SELECT email FROM usuario WHERE email = $1)::int",
            values: [email],
        };

        const rows = await db.query(query);

        return rows;
    }

    async findPassword(email) {
        const query = {
            name: "fetch-email-password",
            text: "SELECT senha FROM usuario WHERE email = $1",
            values: [email],
        };

        const password = await db.query(query);

        return password;
    }

    async findId(email) {
        const query = {
            name: "fetch-email-id",
            text: "SELECT usuario_id FROM usuario WHERE email = $1",
            values: [email],
        };

        const uu_id = await db.query(query);

        // console.log(`é esse ? ${JSON.stringify(uu_id, null, 2)}`);

        return uu_id;
    }

    async createUser({ email, nome, senha }) {

        const hashPass = await bcrypt.hash(senha, 10);

        const query = {
            name: "create-user",
            text: "INSERT INTO usuario(email, nome, senha) VALUES($1, $2, $3)",
            values: [email, nome, hashPass],
        };


        const rows = await db.query(query);

        return rows;

    }
}

module.exports = new UserRepository();
