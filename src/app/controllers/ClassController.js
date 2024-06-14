const { object } = require('prop-types')
const ClassRepository = require('../repositories/ClassRepository')
const UserRepository = require('../repositories/UserRepository')

const criterios = {
    empatia: null,
    organizacao: null,
    feedback: null,
    inovacao: null,
    flexibilidade: null,
    incentivo: null,
    engajamento: null,
}

class ClassController {
    constructor() {
        this.secret
    }

    async addClass(request, response) {
        try {
            const { email, nome, periodo, turno, curso, nivel_formacao } = request.body;
            var classId;

            const role = await UserRepository.findRole(email)

            if (role !== 'Coordenador')
                return response
                    .status(401)
                    .json({ error: 'User Not Authorized' })

            const userID = await UserRepository.findId(email)

            if (ClassRepository.checkIfClass() === 1) {
                classId = await ClassRepository.findCoordClass(nome, userID)

                if (!(!Array.isArray(classId) || !classId.length)) {
                    return response
                        .status(401)
                        .json({ error: 'Class Already Exists' })
                }
            }

            await ClassRepository.createClass(userID, nome, periodo, turno, curso, nivel_formacao)


            classId = await ClassRepository.findCoordClass(nome, userID)

            response.status(200).json({
                success: 'Class Created Succesfully',
                classroom_id: classId,
            })
        } catch (e) {
            response.status(500).json({ error: 'Failed to Create a Class' })
        }
    }

    async deleteClass(request, response) {
        try {
            const { email, nome } = request.body

            const role = await UserRepository.findRole(email)

            if (role !== 'Coordenador')
                return response
                    .status(401)
                    .json({ error: 'User Not Authorized' })

            const userId = await UserRepository.findId(email)

            const classId = await ClassRepository.findCoordClass(nome, userId)

            await ClassRepository.deleteClass(classId)

            response.status(200).json({ success: 'Class Deleted' })
        } catch (e) {
            response.status(500).json({ error: 'Failed to Delete Class' })
        }
    }

    async addStudent(request, response) {
        try {
            const { email, classId } = request.body

            const aClassroom = await ClassRepository.findClassId(classId)
            if (!aClassroom) {
                return response.status(401).json({ error: 'Class Not Found' })
            }

            const aUser = await UserRepository.findEmail(email)
            if (!aUser) {
                return response.status(401).json({ error: 'User Not Found' })
            }

            const role = await UserRepository.findRole(email)

            if (role === 'Coordenador')
                return response
                    .status(401)
                    .json({ error: 'User Is Not a Student' })

            const userId = await UserRepository.findId(email)

            await ClassRepository.createStudent(classId, userId)

            response.status(200).json({ success: 'Student Added Succesfily' })
        } catch (e) {
            response.status(500).json({ error: 'Failed to Add Student' })
        }
    }

    async addProfessor(request, response) {
        try {
            const { email, classId } = request.body

            const aClassroom = await ClassRepository.findClassId(classId)
            if (!aClassroom) {
                return response.status(401).json({ error: 'Class Not Found' })
            }

            console.log(`found: ${aClassroom}`);

            const aUser = await UserRepository.findProfessor(email)
            if (!aUser) {
                return response.status(401).json({ error: 'Professor Not Found' })
            }

            console.log(`found: ${aUser}`);

            const professorId = await UserRepository.findId(email)

            await ClassRepository.addProfessorClass(classId, professorId)

            response.status(200).json({ success: 'Professor Added Succesfily' })
        } catch (e) {
            response.status(500).json({ error: 'Failed to Add Professor' })
        }
    }

    async removeStudent(request, response) {
        try {
            const { email, classId } = request.body

            const aClassroom = await ClassRepository.findClassId(classId)
            if (!aClassroom) {
                return response.status(401).json({ error: 'Class Not Found' })
            }

            const aUser = await UserRepository.findEmail(email)
            if (!aUser) {
                return response.status(401).json({ error: 'User Not Found' })
            }

            const userId = await UserRepository.findId(email)

            const checkStudentIn = await ClassRepository.checkStudent(
                userId,
                classId
            )
            if (!checkStudentIn) {
                return response
                    .status(401)
                    .json({ error: 'User not in this classroom' })
            }

            await ClassRepository.removeStudent(classId, userId)

            response.status(200).json({ success: 'Student Removed' })
        } catch (e) {
            response.status(500).json({ error: 'Failed to Remove Student' })
        }
    }

    async getFeelings(request, response) {
        const { nome, email, sentimento } = request.body

        const classId = await ClassRepository.findClassByName(nome)

        await ClassRepository.addFeeling(classId, sentimento, email) // FRONT DEFINIR SE O EMAIL

        return response.sendStatus(200)
    }

    // Adicionar professor não vai ter essa lógica
    async createTeacher(request, response) {
        const { email, nome, titulo, disciplinas } = request.body

        try {
            const aTeacher = await ClassRepository.findTeacherEmail(email)

            if (aTeacher) {
                return response
                    .status(401)
                    .json({ error: 'Email Already Registered' })
            }

            await ClassRepository.addTeacher(email, nome, titulo, disciplinas)
        } catch (e) {
            return response.status(401).json({ error: 'Failed to add teacher' })
        }

        return response.status(200).json({ success: 'Teacher added successfully' })
    }

    async createEvaluation(request, response) {
        const { docenteId, turmaId, disciplina, new_criterios } = request.body
        const all_criterios = Object.assign({}, criterios, new_criterios) //

        try {
            const teacherId = await ClassRepository.findTeacherId(docenteId);

            if (!teacherId) {
                return response.status(401).json({ error: 'Teacher Not Registered' })
            }

            const classId = await ClassRepository.findClassId(turmaId);

            if (!classId) {
                return response.status(401).json({ error: 'Class Not Registered' })
            }

            await ClassRepository.addEvaluation(
                docenteId,
                turmaId,
                disciplina,
                all_criterios
            )
        } catch (e) {
            return response.status(401).json({ error: 'Failed to create Evaluation' })
        }

        return response
            .status(200)
            .json({ success: 'Evaluation Created Successfully' })
    }

    async setEvaluation(request, response) {
        const { forms, avaliacaoId, alunoId } = request.body

        try {
            var datetime = new Date()
            datetime = datetime.toISOString().slice(0, 10)

            const classId = await ClassRepository.checkEvaluationClass(avaliacaoId);
            const student = await ClassRepository.checkStudent(alunoId, classId);

            if (!student) {
                return response.status(401).json({ error: 'Student not in Classroom' })
            }

            ClassRepository.createEvaluation(
                datetime,
                avaliacaoId,
                alunoId,
                forms
            )
        } catch (e) {
            return response
                .status(500)
                .json({ error: 'Failed to set Evaluation' })
        }

        return response.status(200).json({ success: 'Evaluation added' })
    }

    async classInfo(request, response) {
        const { turma_id } = request.body; // verificaçao se ja resp ?

        const countRespostas = await ClassRepository.countAnswers(turma_id);
        const countAvaliacoes = await ClassRepository.countEvaluations(turma_id);
        const quorumEstudantes = await ClassRepository.studentQuorum(turma_id);
        const grades = await ClassRepository.getJsonGrades(turma_id);
        const nomeClasse = await ClassRepository.getClassName(turma_id);
        const cursoClasse = await ClassRepository.getCurso(turma_id);
        const tipoCurso = await ClassRepository.getNivelFormacao(turma_id);
        const turnoCurso = await ClassRepository.getTurno(turma_id);
        const getUsers = await ClassRepository.getUsersFromClass(turma_id);

        var sum = 0;
        var nog = 0; // number of grades

        grades.forEach(obj => {
            const values = Object.values(obj.respostas);
            values.forEach(value => {
              sum += value;
              nog += 1;
            });
        });

        const gradeMean = sum / nog;

        const engajamento = (countRespostas / quorumEstudantes * 100) + "%";

        return response.status(200).json(
            {
                gradeMean: gradeMean,
                countRespostas: countRespostas,
                countAvaliacoesCriadas: countAvaliacoes,
                quorumEstudantes: quorumEstudantes,
                engajamento: engajamento,
                nomeClasse: nomeClasse,
                cursoClasse: cursoClasse,
                tipoCurso: tipoCurso,
                turnoCurso: turnoCurso,
                users: getUsers
            });

    }

    async getGeneralInishgts(request, response) { // Precisa ser testado!!
        const { coordenador_id } = request.body;

        const professors_ids = ClassRepository.getProfessors(coordenador_id);
        const professorsGrades = ClassRepository.getProfessorsGrades(professors_ids);



    }
}

module.exports = new ClassController()
