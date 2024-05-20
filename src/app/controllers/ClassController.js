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
            const { email, nome, periodo } = request.body
            var classId

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

            await ClassRepository.createClass(userID, nome, periodo)

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

        await ClassRepository.addFeeling(classId, sentimento, email) // FRONT DEFINIR SE O EMAIL É "ANONIMO" OU O EMAIL REAL!!! ---------

        return response.sendStatus(200)
    }

    // Adicionar professor não vai ter essa lógica
    // async createTeacher(request, response) {
    //     const { email, nome, titulo, disciplinas } = request.body

    //     try {
    //         const aTeacher = await ClassRepository.findTeacherEmail(email)

    //         if (aTeacher) {
    //             return response
    //                 .status(401)
    //                 .json({ error: 'Email Already Registered' })
    //         }

    //         await ClassRepository.addTeacher(email, nome, titulo, disciplinas)
    //     } catch (e) {
    //         return response.status(401).json({ error: 'Failed to add teacher' })
    //     }

    //     return response.status(200).json({ success: 'Teacher added successfully' })
    // }

    // add validations
    async createEvaluation(request, response) {
        const { docenteId, turmaId, disciplina, new_criterios } = request.body
        const all_criterios = Object.assign({}, criterios, new_criterios)

        try {

            await ClassRepository.addEvaluation(
                docenteId,
                turmaId,
                disciplina,
                all_criterios
            )

        } catch(e) {
            return response.status(401).json({ error: e })
        }

        return response.status(200).json({ success: 'Evaluation Created Successfully' })
    }

    // Validate now 
    async setEvaluation(request, response){
        const { forms, avaliacaoId, alunoId } = request.body;

        try{
            var datetime = new Date();
            datetime = datetime.toISOString().slice(0,10);

            ClassRepository.createEvaluation(datetime, avaliacaoId, alunoId, forms);
        }
        catch(e){
            return response.status(500).json({ error: 'Failed to set Evaluation' });
        }

        return response.sendStatus(200);
    }

}

module.exports = new ClassController()


