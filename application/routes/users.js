'use strict';

const User = require('../models/User');
const authHeaders = require('../schemas/authHeaders');
const errorSchema = require('../schemas/error');
const userSchema = require('../schemas/user');

const users = (fastify) => {
  const { authorize } = fastify;
  fastify.addHook('onRequest', authorize);

  const onFindUser = async (request, reply) => {
    const { id } = request.params;
    const user = await User.findOne({ id });
    if (user) return user;
    return reply.notFound('User was not found');
  };

  fastify.route({
    method: 'GET',
    path: '/users/:id',
    handler: onFindUser,
    schema: {
      description: 'Returns user object by id',
      response: { 200: userSchema.full, 404: errorSchema, 401: errorSchema },
      headers: authHeaders,
    },
  });

  const onCreate = async (request, reply) => {
    const { id, nickname, avatarId, locale } = request.body;
    const user = await User.find({ id });
    if (user) return reply.conflict('User already exists');
    const createdUser = await User.create({ id, nickname, avatarId, locale });
    return createdUser;
  };

  fastify.route({
    method: 'POST',
    path: '/users',
    handler: onCreate,
    schema: {
      description: 'Creates new user',
      body: userSchema.required,
      headers: authHeaders,
      response: {
        200: userSchema.full,
        404: errorSchema,
        401: errorSchema,
        409: errorSchema,
      },
    },
  });

  // TODO: Locale should be checked against supported locales
  const onUserEdit = async (request, reply) => {
    const { id } = request.params;
    const { nickname, avatarId, locale } = request.body;
    const user = await User.findOneAndUpdate({ id }, { nickname, avatarId, locale });
    if (user) return user;
    return reply.notFound('User was not found');
  };

  fastify.route({
    method: 'PATCH',
    path: '/users/:id',
    handler: onUserEdit,
    schema: {
      description: 'Edits user',
      body: userSchema.public,
      headers: authHeaders,
      response: {
        200: userSchema.full,
        404: errorSchema,
        401: errorSchema,
        409: errorSchema,
      },
    },
  });
};

module.exports = users;
