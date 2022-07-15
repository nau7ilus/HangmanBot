"use strict";

const S = require("fluent-json-schema");

module.exports = S.object().prop("authorization", S.string().required());
