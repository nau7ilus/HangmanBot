"use strict";

const randomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];

const calculateNeededExp = (level) => {
  if (level <= 15) return 2 * level + 7;
  else if (level <= 30) return 5 * level - 38;
  else return 9 * level - 158;
};

const unique = (array) => [...new Set(array)];

const calculateGameExp = (game) => {
  const { word, mistakes, guessed, attemptsLeft } = game;
  const wordLength = word.length;
  return wordLength * attemptsLeft - mistakes.length + guessed.length;
};

const protect = (fields, doc) => {
  const copy = { ...doc.toJSON() };
  for (const field of fields) delete copy[field];
  return copy;
};

module.exports = {
  randomElement,
  calculateNeededExp,
  unique,
  calculateGameExp,
  protect,
};
