const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('../swagger-output.json');
const cors = require('cors');

const routes = require('./routes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))

app.listen(3000, () => console.log('Server started at http://localhost:3000'));
