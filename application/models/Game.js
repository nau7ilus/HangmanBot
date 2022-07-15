'use strict';

const { Schema, model } = require('mongoose');

const GameSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'users', required: true },
    locale: { type: String, default: 'ru', enum: ['ru', 'de'] },
    word: { type: String, required: true },
    guessed: [{ type: String }],
    mistakes: [{ type: String }],
    isFinished: { type: Boolean, default: false },
    attemptsLeft: { type: Number, default: 6 },
    experience: { type: Number, default: 0 },
    finishedAt: { type: Date },
  },
  { versionKey: false, timestamp: true },
);

module.exports = model('games', GameSchema);
