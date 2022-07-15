'use strict';

const { Schema, model } = require('mongoose');
const { randomElement } = require('../helpers/util');

const defaultAvatarIds = ['0', '1', '2', '3', '4', '5'];

const UserSchema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    locale: { type: String, default: 'ru', enum: ['ru', 'de'] },
    nickname: { type: String, default: 'Player' },
    avatarId: { type: String, default: randomElement(defaultAvatarIds) },
    level: { type: Number, default: 0 },
    score: { type: Number, default: 0 },
  },
  { versionKey: false, timestamp: true },
);

module.exports = model('users', UserSchema);
