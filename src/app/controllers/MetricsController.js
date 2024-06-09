const MetricsRepository = require("../repositories/MetricsRepository");
const PDFDocument = require('pdfkit');
const fs = require('fs');


function round(value, precision) {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
}

class MetricsController {
    async TeacherMetrics(request, response) {
        const { professor_id } = request.body
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

    async exportMetrics(request, response) {
        
        // ! Código repetido, refatorar se possível

        const { professor_id } = request.body
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
        
        


        // * Criando um PDF e exportando

        var dados = JSON.parse(JSON.stringify(new_metrics))
        const doc = new PDFDocument()
        const stream = fs.createWriteStream('output.pdf')

        doc.pipe(stream)
        
        
        doc.fontSize(20).text('Métricas do Professor')
        doc.moveDown()

        doc.fontSize(16).text('Nome: '+ dados.nome).text('Titulo: '+ dados.titulo).text('Disciplinas: '+ dados.disciplinas).text('Avaliações: '+ dados.avaliacoes)
            
        doc.fontSize(16).text('Criterios:')
        Object.entries(dados.criterios).forEach(([criterio, valor]) => {
            doc.fontSize(12).text(`${criterio} : ${valor}`, {
                align: 'left'
            })
            })
        
        doc.moveDown()
        doc.fontSize(10).text('Respostas:'+ dados.respostas).text('Media:'+ dados.media)
        
        doc.end()
     
        
        stream.on('finish', function () {
            response.download('output.pdf', 'metricas_prof.pdf', function(err){
                if (err) {
               
                    response.status(500).send("Error downloading the file.")
                }
            })
        })
        stream.on('error', function(err) {
            response.status(500).send("Error writing the PDF file.")
        })
    }
}

module.exports = new MetricsController()
