'use strict';

const { Schema, model } = require('mongoose');

const WordSchema = new Schema(
  {
    locale: { type: String, default: 'ru', enum: ['ru', 'de'] },
    word: { type: String, required: true, unique: true },
  },
  { versionKey: false },
);

module.exports = model('words', WordSchema);
