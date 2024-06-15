const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
require('dotenv').config();

const PORT = process.env.NODE_LOCAL_PORT || 8080;

const options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Carpool API',
      version: '1.0.0',
      description: 'Carpool API Documentation',
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./app/routes/*.js'],
};

const specs = swaggerJsDoc(options);

module.exports = {
  swaggerUi,
  specs,
};
