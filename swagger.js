const swaggerAutogen = require('swagger-autogen')({openapi: '3.0.0'});

const doc = {
    info: {
        version: '0.1.2',            // by default: '1.0.0'
        title: 'Evalu.at API',              // by default: 'REST API'
        description: 'Documentation of the endpoints from the Evalu.at API'         // by default: ''
    },
    servers: [
    {
        url: 'https://evalu-at.github.io/evaluat-backend/',              // by default: 'http://localhost:3000'
        description: ''       // by default: ''
    },
    ],
    tags: [                   // by default: empty Array
    {
        name: 'default',
        description: ''
    },
    {
        name: 'user',             // Tag name
        description: 'user endpoints'       // Tag description
    },
    {
        name: 'adm',
        description: 'adm endpoints'
    }

    ],
    components: {
        schemas: {
            userIdBody: {
                $id: "user@email.com",
            },
            userAddBody: {
                $email: "user@email.com",
                $nome: "username",
                $senha: "password"
            },
            userLoginBody: {
                $email: "user@email.com",
                $senha: "password"
            }
        }
    }
};

const outputFile = './swagger-output.json';
const routes = ['./src/routes.js'];


swaggerAutogen(outputFile, routes, doc);
