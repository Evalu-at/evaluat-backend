const UserRepository = require('../repositories/UserRepository')

class ClassController {
    constructor() {
        this.secret
    }

    async addClass(request, response) {
        try {
            const { email, nome, periodo } = request.body

            const role = await UserRepository.findRole(email)

            if (role !== 'Coordenador')
                return response
                    .status(401)
                    .json({ error: 'User Not Authorized' })

            const userID = await UserRepository.findId(email)

            var classId = await UserRepository.findCoordClass(nome, userID)

            if (!(!Array.isArray(classId) || !classId.length)) {
                return response.status(401).json({ error: 'Class Exists' })
            }

            await UserRepository.createClass({
                userID,
                nome,
                periodo,
            })

            classId = await UserRepository.findCoordClass(nome, userID)

            response.status(200).json({
                success: 'Class Created Succesfully',
                classroom_id: classId[0].id,
            })
        } catch (e) {
            response.status(500).json(e)
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

            const classId = await UserRepository.findCoordClass(nome, userId)

            await UserRepository.deleteClass(classId[0].id)

            response.status(200).json({ success: 'Class Deleted' })
        } catch (e) {
            response.status(500).json({ error: 'Failed to Delete Class' })
        }
    }

    async addStudent(request, response) {
        try {
            const { email, classId } = request.body

            const aClassroom = await UserRepository.findClassId(classId);
            if (!aClassroom) {
                return response.status(401).json({ error: 'Class Not Found' });
            }

            const aUser = await UserRepository.findEmail(email);
            if (!aUser) {
                return response.status(401).json({ error: 'User Not Found' });
            }

            const userId = await UserRepository.findId(email);

            console.log()

            await UserRepository.createStudent({
                classId,
                userId
            });

            response.status(200).json({ success: "Student Added Succesfily" })
        } catch (e) {
            response.status(500).json(e)
        }
    }
}

module.exports = new ClassController()
