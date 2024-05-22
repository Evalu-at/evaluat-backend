const db = require('../../database')

class ClassRepository {
    constructor() {}

    async addFeeling(classId, sentimento, email) {
        const query = {
            name: 'update-feeling-id',
            text: 'INSERT INTO sentimento(turma_id, sentimento, email) VALUES($1, $2, $3)', // Precisa de coluna pra verified email em usuario, return 0 ou 1
            values: [classId, sentimento, email],
        }

        await db.query(query)
    }

    async findTeacherEmail(email) {
        const query = {
            nome: 'find-teacher-email',
            text: 'SELECT EXISTS (SELECT email FROM professor WHERE email = $1)::bool',
            values: [email],
        }

        const mail = await db.query(query)

        return mail[0].exists
    }

    async findTeacherId(id) {
        const query = {
            nome: 'find-teacher-id',
            text: 'SELECT EXISTS (SELECT id FROM professor WHERE id = $1)::bool',
            values: [id],
        }

        const ID = await db.query(query)

        return ID[0].exists
    }

    async findClassByName(nome) {
        const query = {
            nome: 'fetch-class-id-by-name',
            text: 'SELECT id FROM turma WHERE nome = $1',
            values: [nome],
        }

        const id = await db.query(query)

        return id[0].id
    }

    async findCoordClass(nome, coordenador_id) {
        const query = {
            nome: 'fetch-class-id',
            text: 'SELECT id FROM turma WHERE nome = $1 AND coordenador_id = $2',
            values: [nome, coordenador_id],
        }

        const id = await db.query(query)

        return id[0].id
    }

    async findClassId(classId) {
        const query = {
            nome: 'find-classroom',
            text: 'SELECT EXISTS (SELECT id FROM turma WHERE id = $1)::bool',
            values: [classId],
        }

        const id = await db.query(query)

        return id[0].exists
    }

    async checkIfClass() {
        const query = {
            nome: 'check-classroom',
            text: 'select EXISTS (SELECT * FROM turma)::int',
        }

        const check = await db.query(query)

        return check
    }

    async createClass(userID, nome, periodo) {
        const query = {
            name: 'create-class',
            text: 'INSERT INTO turma(coordenador_id, nome, periodo) VALUES($1, $2, $3)',
            values: [userID, nome, periodo],
        }

        await db.query(query)
    }

    async createStudent(classId, userId) {
        const query = {
            nome: 'create-student',
            text: 'INSERT INTO turma_usuario(turma_id, usuario_id) VALUES($1, $2)',
            values: [classId, userId],
        }

        await db.query(query)
    }

    async removeStudent(classId, userId) {
        const query = {
            nome: 'remove-student',
            text: 'DELETE FROM turma_usuario WHERE turma_id = $1 AND usuario_id = $2',
            values: [classId, userId],
        }

        await db.query(query)
    }

    async checkStudent(userId, turmaId) {
        const query = {
            name: 'find-student-class',
            text: 'SELECT EXISTS (SELECT usuario_id FROM turma_usuario WHERE usuario_id = $1 AND turma_id = $2)::bool',
            values: [userId, turmaId],
        }

        const check = await db.query(query)

        return check[0].exists
    }

    async checkEvaluationClass(id) {
        const query = {
            name: 'find-evaluation-classroom',
            text: 'SELECT turma_id FROM avaliacao WHERE id = $1',
            values: [id],
        }

        const check = await db.query(query)

        return check[0].turma_id
    }

    async deleteClass(id) {
        const query = {
            name: 'delete-class',
            text: 'DELETE FROM turma where id = $1',
            values: [id],
        }

        await db.query(query)
    }

    // A logica pode mudar
    // async addTeacher(email, nome, titulo, disciplinas) {
    //     const query = {
    //         name: 'add-teacher',
    //         text: 'INSERT INTO professor (email, nome, titulo, disciplinas) VALUES($1, $2, $3, $4)',
    //         values: [email, nome, titulo, disciplinas]
    //     }

    //     await db.query(query);
    // }

    async addEvaluation(docenteId, turmaId, disciplina, criterios) {
        const query = {
            name: 'add-evaluation',
            text: 'INSERT INTO avaliacao(professor_id, turma_id, disciplina, criterios) VALUES($1, $2, $3, $4)',
            values: [docenteId, turmaId, disciplina, criterios]
        }

        await db.query(query);
    }

    async createEvaluation(datetime, avaliacaoId, alunoId, forms) {
        const query = {
            nome: "create-evaluation",
            text: "INSERT INTO respostas (DATA, avaliacao_id, aluno_id, respostas) VALUES($1, $2, $3, $4)",
            values: [datetime, avaliacaoId, alunoId, forms],
        };

        await db.query(query);
    }

    async countAnswers(turma){
        const query = {
            nome: "assert-answer-total",
            text: "SELECT COUNT(respostas) FROM respostas WHERE avaliacao = (SELECT id FROM avaliacao WHERE turma = $1)",
            values: [turma]
        };

        await db.query(query);

        return db.query(query);
    }

    async countAnswers(turma){
        const query = {
            nome: "assert-answer-total",
            text: "SELECT COUNT(respostas) FROM respostas WHERE avaliacao_id = (SELECT id FROM avaliacao WHERE turma = $1)",
            values: [turma]
        };

        await db.query(query);

        return db.query(query);
    }

    async countEvaluations(turma){
        const query = {
            nome: "assert-answer-total",
            text: "SELECT COUNT(*) FROM avaliacao WHERE turma = $1",
            values: [turma]
        };

        await db.query(query);

        return db.query(query);
    }

    async studentQuorum(turma_id){
        const query = {
            nome: "assert-student-quorum",
            text: "SELECT COUNT(*) FROM turma_usuario WHERE turma_id = $1",
            values: [turma_id]
        };

        await db.query(query);

        return db.query(query);
    }
}

module.exports = new ClassRepository()
