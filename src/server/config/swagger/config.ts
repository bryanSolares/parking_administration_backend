import swaggerJsDoc from 'swagger-jsdoc';

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0',
      description: 'API Documentation using Swagger'
    },
    servers: [
      {
        url: 'http://localhost:3500/api/v1'
      }
    ]
  },
  apis: ['./src/infrastructure/http/routes/*.ts']
};

export const config = swaggerJsDoc(swaggerOptions);
