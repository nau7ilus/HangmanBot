"use strict";

const {
  createGameCard,
  createWinCard,
  createLoseCard,
} = require("@nieopierzony/hangman-drawer");

const cardTypes = {
  game: createGameCard,
  win: createWinCard,
  lose: createLoseCard,
};

module.exports = async (options = {}) => {
  const canvas = await cardTypes[options?.type](options);
  const buffer = canvas.toBuffer("image/png");
  return buffer;
};
