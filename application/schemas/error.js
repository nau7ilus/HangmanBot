"use strict";

const S = require("fluent-json-schema");

module.exports = S.object()
  .prop("statusCode", S.number().required())
  .prop("message", S.string().required())
  .prop("error", S.string().required());
