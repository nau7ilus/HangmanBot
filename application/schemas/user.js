'use strict';

const S = require('fluent-json-schema');

const publicUser = S.object()
  .prop('nickname', S.string().required())
  .prop('avatarId', S.string())
  .prop('locale', S.string().required());

const required = publicUser.prop('id', S.string().required());

const full = required
  .prop('level', S.number())
  .prop('score', S.number())
  .prop('createdAt', S.string().format('time'))
  .prop('updatedAt', S.string().format('time'));

module.exports = { required, full, public: publicUser };
