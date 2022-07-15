"use strict";

const S = require("fluent-json-schema");
const { version } = require("../package.json");

const status = async (fastify) => {
  const onStatus = () => ({ status: "ok", version });

  fastify.route({
    method: "GET",
    path: "/status",
    handler: onStatus,
    schema: {
      description: "Returns status and version of the application",
      response: {
        200: S.object()
          .prop("status", S.string().required())
          .prop("version", S.string().required()),
      },
    },
  });
};

module.exports = status;
