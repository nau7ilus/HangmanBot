"use strict";

const path = require("node:path");
const Env = require("@fastify/env");
const S = require("fluent-json-schema");
const Sensible = require("@fastify/sensible");
const UnderPressure = require("@fastify/under-pressure");
const Cors = require("@fastify/cors");
const AutoLoad = require("@fastify/autoload");
const mongoose = require("mongoose");

module.exports = async (fastify, opts) => {
  const envOptions = {
    schema: S.object()
      .prop("NODE_ENV", S.string().required())
      .prop("MONGO_URL", S.string().required())
      .prop("AUTH_TOKEN", S.string().required())
      .valueOf(),
  };

  const connectDatabase = () =>
    mongoose
      .connect(fastify.config.MONGO_URL)
      .then(() => fastify.log.info("MongoDB connected"))
      .catch(fastify.log.error);

  fastify.register(Env, envOptions).ready((err) => {
    if (err) console.error(err);
    connectDatabase();
  });

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
    dir: path.join(__dirname, "plugins"),
    options: Object.assign({}, opts),
  });

  // Load routes
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, "routes"),
    dirNameRoutePrefix: false,
    options: Object.assign({}, opts),
  });
};
