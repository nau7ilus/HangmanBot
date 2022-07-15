"use strict";

const fp = require("fastify-plugin");

const authorization = (fastify, opts, done) => {
  const { httpErrors, config } = fastify;
  const authorize = (request, reply, done) => {
    const { authorization } = request.headers;
    if (!authorization) {
      throw httpErrors.unauthorized("Authorization header is required");
    }
    const [type, token] = authorization.split(" ");
    if (type !== "Bearer") {
      throw httpErrors.unauthorized("Authorization header is invalid");
    }
    if (token !== config.AUTH_TOKEN) {
      throw httpErrors.unauthorized("Authorization header is invalid");
    }
    done();
  };

  fastify.decorate("authorize", authorize);
  done();
};

module.exports = fp(authorization, { name: "authorization" });
