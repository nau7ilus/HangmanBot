'use strict';

const S = require('fluent-json-schema');
const userSchema = require('./user');

// TODO
const full = S.object()
  .prop('_id', S.string().required())
  .prop('user', userSchema.full)
  .prop('locale', S.string().required())
  .prop('word', S.string().required())
  .prop('guessed', S.string().required())
  .prop('mistakes', S.string().required())
  .prop('isFinished', S.string().required())
  .prop('attemptsLeft', S.string().required())
  .prop('experience', S.string().required())
  .prop('finishedAt', S.string().required());

module.exports = { full };
