import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUiExpress from 'swagger-ui-express';
import __dirname from '../utils/index.js';
import path from 'path';

const swaggerOptions = {
    definition: {
        openapi: '3.0.1',
        info: {
            title: 'Adoptme API',
            version: '1.0.0',
            description: 'API para gestión de adopciones de mascotas'
        }
    },
    apis: [path.join(__dirname, '../docs/**/*.yaml')]
};

const specs = swaggerJsdoc(swaggerOptions);

export { specs, swaggerUiExpress };
