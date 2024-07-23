import swaggerJsDoc, { Options } from 'swagger-jsdoc';

const swaggerOptions: Options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Parking System API',
      version: '1.0.0',
      description: 'API Documentation using Swagger',
      contact: {
        name: 'Bryan Solares',
        email: 'bryan.solares@claro.com.gt',
        url: 'https://bryan-solares.com'
      }
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
