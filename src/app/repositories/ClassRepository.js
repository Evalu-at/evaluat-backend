const db = require("../../database");

class ClassRepository {
    constructor() {
        
    }

    async addFeeling(classId, sentimento,  email) {
        const query = {
            name: "update-feeling-id",
            text: "INSERT INTO sentimento(turma_id, sentimento, email) VALUES($1, $2, $3)", // Precisa de coluna pra verified email em usuario, return 0 ou 1
            values: [classId, sentimento, email],
        };

        await db.query(query);
    }

    async findClassByName(nome) {
        const query = {
            nome: "fetch-class-id-by-name",
            text: "select id from turma where nome = $1",
            values: [nome],
        }

        const id = await db.query(query);

        return id[0].id;
    }

    async findCoordClass(nome, coordenador_id) {
        const query = {
            nome: "fetch-class-id",
            text: "SELECT id FROM turma WHERE nome = $1 AND coordenador_id = $2",
            values: [nome, coordenador_id],
        }

        const id = await db.query(query);

        return id[0].id;
    }

    async findClassId(classId) {
        const query = {
            nome: "find-classroom",
            text: "SELECT EXISTS (SELECT id FROM turma WHERE id = $1)::bool",
            values: [classId],
        }

        const id = await db.query(query);

        return id[0].exists;
    }

    async checkIfClass() {
        const query = {
            nome: "check-classroom",
            text: "select EXISTS (SELECT * FROM turma)::int",
        }

        const check = await db.query(query);

        return check;
    }

    async createClass(userID, nome, periodo) {

        const query = {
            name: "create-class",
            text: "INSERT INTO turma(coordenador_id, nome, periodo) VALUES($1, $2, $3)",
            values: [userID, nome, periodo],
        };

        await db.query(query);
    }

    async createStudent(classId, userId) {
        const query = {
            nome: "create-student",
            text: "INSERT INTO turma_usuario(turma_id, usuario_id) VALUES($1, $2)",
            values: [classId, userId],
        };

        await db.query(query);
    }

    async removeStudent(classId, userId) {
        const query = {
            nome: "remove-student",
            text: "DELETE FROM turma_usuario WHERE turma_id = $1 AND usuario_id = $2",
            values: [classId, userId]
        }

        await db.query(query);
    }

    async deleteClass(id) {

        const query = {
            name: "delete-class",
            text: "DELETE FROM turma where id = $1",
            values: [id],
        };

        await db.query(query);
    }
}

module.exports = new ClassRepository();
