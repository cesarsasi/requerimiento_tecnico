import swaggerAutogen from 'swagger-autogen';

const swaggerGenerator = swaggerAutogen({ openapi: '3.0.0' });

const outputFile: string = '../../swagger.json'; 
const endpointsFiles: string[] = ['../app.ts'];
 
const doc = {
  info: {
    version: "1.0.0",
    title: 'API de Gestión de Usuarios y Cursos',
    description: 'Documentación generada automáticamente para prueba técnica eclass',
  },
  host: `${process.env.HOST || 'localhost'}:${process.env.PORT || 3000}`,
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  security: [
    {
      BearerAuth: [],
    },
  ],
};

swaggerGenerator(outputFile, endpointsFiles, doc).then(() => {
  require('../index.ts');
});
