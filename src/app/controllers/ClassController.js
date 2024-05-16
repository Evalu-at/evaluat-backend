const ClassRepository = require('../repositories/ClassRepository');
const UserRepository = require('../repositories/UserRepository');

class ClassController {
    constructor() {
        this.secret
    }

    async addClass(request, response) {
        try {
            const { email, nome, periodo } = request.body
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

            await ClassRepository.createClass(
                userID,
                nome,
                periodo,
            )

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

            await ClassRepository.createStudent(
                classId,
                userId,
            )

            response.status(200).json({ success: 'Student Added Succesfily' })
        } catch (e) {
            response.status(500).json({ error: 'Failed to Add Student' })
        }
    }

    async removeStudent(request, response) {
        try {
            const { email, classId } = request.body

            const aClassroom = await ClassRepository.findClassId(classId);
            if (!aClassroom) {
                return response.status(401).json({ error: 'Class Not Found' });
            }

            const aUser = await UserRepository.findEmail(email)
            if (!aUser) {
                return response.status(401).json({ error: 'User Not Found' });
            }

            const userId = await UserRepository.findId(email);

            const checkStudentIn = await ClassRepository.checkStudent(userId, classId);
            if (!checkStudentIn) {
                return response.status(401).json({ error: 'User not in this classroom' });
            }

            await ClassRepository.removeStudent(
                classId,
                userId
            );

            response.status(200).json({ success: 'Student Removed' });

        } catch (e) {
            response.status(500).json({ error: 'Failed to Remove Student' })
        }
    }

    async getFeelings(request, response) {
        const { nome, email, sentimento } = request.body;

        const classId = await ClassRepository.findClassByName(nome);

        ClassRepository.addFeeling(classId, sentimento, email) // FRONT DEFINIR SE O EMAIL É "ANONIMO" OU O EMAIL REAL!!! ---------

        return response.sendStatus(200);
    }

    async getEvaluation(request, response){
        const { empatia, organizacao, inovacao,
            flexibilidade, incentivo, engajamento,
            feedback } = request.body;

        var datetime = new Date();
        datetime = datetime.toISOString().slice(0,10);
        console.log(datetime);

        try{
            ClassRepository.createEvaluation(datetime, empatia,
                organizacao, inovacao, flexibilidade, incentivo,
                engajamento, feedback);
        }
        catch(e){
            return response.status(500).json({ error: 'Failed to Remove Student' });
        }

        return response.sendStatus(200);
    }

}

module.exports = new ClassController()


