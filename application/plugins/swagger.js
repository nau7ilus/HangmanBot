'use strict';

const Swagger = require('@fastify/swagger');
const fp = require('fastify-plugin');
const { version } = require('../package.json');

const swaggerGenerator = (fastify, opts, done) => {
  fastify.register(Swagger, {
    exposeRoute: fastify.config.NODE_ENV !== 'production',
    routePrefix: '/documentation',
    swagger: {
      info: {
        title: 'Hangman Discord bot API',
        description: 'The implementation of the game Hangman in the form of a Discord bot',
        version,
      },
      host: 'localhost:3000',
      schemes: ['http', 'https'],
      consumes: ['application/json'],
      produces: ['application/json'],
      securityDefinitions: {
        Bearer: {
          type: 'apiKey',
          name: 'Bearer',
          in: 'header',
        },
      },
    },
  });
  done();
};

module.exports = fp(swaggerGenerator, { name: 'swaggerGenerator' });
