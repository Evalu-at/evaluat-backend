const db = require('../../database')

class MetrictsRepository {
    async fetchTheacherMetrics(professor_id) {
        const q1 = {
            name: 'fetch-teacher-metrics',
            text: `SELECT FirstSet.nome, FirstSet.titulo, FirstSet.disciplinas, SecondSet.avaliacoes, SecondSet.criterios, ThirdSet.respostas
                    FROM
                    (
	                    SELECT nome, titulo, disciplinas, id
	                    FROM professor
	                    WHERE id = $1
                    ) AS FirstSet,
                    (
	                    SELECT count(*) AS avaliacoes, criterios
	                    FROM avaliacao
	                    WHERE professor_id = $1
                        GROUP BY criterios
                    ) AS SecondSet,
                    (
                        SELECT count(r.*) AS respostas
                        FROM respostas r, avaliacao a
                        WHERE a.professor_id = $1 AND a.id = r.avaliacao_id
                    ) AS ThirdSet
                    `,
            values: [professor_id],
        }

        const q2 = {
            name: 'fetch-all-answers',
            text: 'SELECT r.respostas FROM respostas r, avaliacao a WHERE a.professor_id = $1 AND a.id = r.avaliacao_id',
            values: [professor_id],
        }

        const metrics = await db.query(q1)
        const answers = await db.query(q2)

        return [metrics[0], answers]
    }
}

module.exports = new MetrictsRepository()
