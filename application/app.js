'use strict';

require('dotenv').config();

const path = require('node:path');
const AutoLoad = require('@fastify/autoload');
const Cors = require('@fastify/cors');
const Sensible = require('@fastify/sensible');
const UnderPressure = require('@fastify/under-pressure');
const mongoose = require('mongoose');

const { MONGO_URL } = process.env;

module.exports = (fastify, opts) => {
  mongoose
    .connect(MONGO_URL)
    .then(() => fastify.log.info('MongoDB connected'))
    .catch(fastify.log.error);

  fastify.register(Sensible);

  fastify.register(UnderPressure, {
    maxEventLoopDelay: 10 ** 3,
    maxHeapUsedBytes: 10 ** 9,
    maxRssBytes: 10 ** 9,
    maxEventLoopUtilization: 0.98,
  });

  // Load cors
  fastify.register(Cors, {
    origin: false,
  });

  // Load plugins
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'plugins'),
    options: Object.assign({}, opts),
  });

  // Load routes
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'routes'),
    dirNameRoutePrefix: false,
    options: Object.assign({}, opts),
  });
};
