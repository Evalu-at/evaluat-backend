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

        return rows[0].exists;
    }

    async findPassword(email) {
        const query = {
            name: "fetch-email-password",
            text: "SELECT senha FROM usuario WHERE email = $1",
            values: [email],
        };

        const password = await db.query(query);

        return password[0].senha;
    }

    async findId(email) {
        const query = {
            name: "fetch-email-id",
            text: "SELECT usuario_id FROM usuario WHERE email = $1",
            values: [email],
        };

        const uu_id = await db.query(query);

        return uu_id;
    }

    async findVerifiedEmail(email) {
        const query = {
            name: "fetch-email-id",
            text: "SELECT email_verificado FROM usuario WHERE email = $1", // Precisa de coluna pra verified email em usuario, return 0 ou 1
            values: [email],
        };

        const verifiedEmail = await db.query(query);

        return verifiedEmail;
    }

    async updateVerifiedEmail(email) {
        const query = {
            name: "fetch-email-id",
            text: "UPDATE usuario SET email_verificado = 1 WHERE email = $1", // Precisa de coluna pra verified email em usuario, return 0 ou 1
            values: [email],
        };

        const updatedEmailVerification = await db.query(query);

        return updatedEmailVerification;
    }

    async findVerifiedEmail(email) {
        const query = {
            name: "fetch-email-id",
            text: "SELECT email_verificado FROM usuario WHERE email = $1", // Precisa de coluna pra verified email em usuario, return 0 ou 1
            values: [email],
        };

        const verifiedEmail = await db.query(query);

        return verifiedEmail;
    }

    async updateVerifiedEmail(email) {
        const query = {
            name: "fetch-email-id",
            text: "UPDATE usuario SET email_verificado = 1 WHERE email = $1", // Precisa de coluna pra verified email em usuario, return 0 ou 1
            values: [email],
        };

        const updatedEmailVerification = await db.query(query);

        return updatedEmailVerification;
    }

    async findRole(email) {
        const query = {
            name: "fetch-role",
            text: "SELECT cargo FROM usuario WHERE email = $1",
            values: [email],
        };

        const role = await db.query(query);

        return role[0].cargo;
    }

    async createUser({ email, nome, senha, cargo }) {
        const hashPass = await bcrypt.hash(senha, 10);

        const query = {
            name: "create-user",
            text: "INSERT INTO usuario(email, nome, senha, cargo) VALUES($1, $2, $3, $4)",
            values: [email, nome, hashPass, cargo],
        };


        const rows = await db.query(query);

        return rows;

    }
}

module.exports = new UserRepository();
