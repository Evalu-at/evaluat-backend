const MetricsRepository = require("../repositories/MetricsRepository");
const UserRepository = require("../repositories/UserRepository");

function round(value, precision) {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
}

class MetricsController {
    async TeacherMetrics(request, response) {
        const { email, professor_id } = request.body

        const role = await UserRepository.findRole(email)

        if (role === 'Aluno')
            return response
                .status(401)
                .json({ error: 'O usuário não é um coordenador' })

        const metrics = await MetricsRepository.fetchTheacherMetrics(professor_id)

        const metric_values = metrics[0].criterios
        var all_values = 0

        metrics[1].forEach((metric) => {
            Object.keys(metric.respostas).forEach((tipo) => {
                metric_values[tipo] += metric.respostas[tipo]
            })
        })

        const divide = metrics[1].length

        Object.keys(metric_values).forEach((value) => {
            metric_values[value] = round((metric_values[value] / divide), 1)
            all_values += metric_values[value]
        })

        all_values = round((all_values / Object.keys(metric_values).length), 1)

        var new_metrics = { media: all_values }
        new_metrics = Object.assign({}, metrics[0], new_metrics)

        response.status(200).json(new_metrics)
    }

}

module.exports = new MetricsController()
