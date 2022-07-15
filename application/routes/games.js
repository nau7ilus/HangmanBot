"use strict";

const S = require("fluent-json-schema");
const User = require("../models/User");
const Game = require("../models/Game");
const Word = require("../models/Word");
const authHeaders = require("../schemas/authHeaders");
const { unique, calculateGameExp, protect } = require("../helpers/util");

const addUserExp = async (user, exp) => {
  console.log("ADD USER EXP", user, exp);
};

const games = async (fastify) => {
  const { authorize } = fastify;
  fastify.addHook("onRequest", authorize);

  const onGameCreate = async (request, reply) => {
    const { userId } = request.body;
    const user = await User.findOne({ id: userId });
    if (!user) return reply.notFound("User not found");
    const alreadyCreated = await Game.findOne({ user: user._id });
    if (alreadyCreated) return reply.conflict("User already has a game");
    const { locale } = user;
    const wordCount = await Word.count({ locale });
    const { word } = await Word.findOne({ locale }).skip(
      Math.floor(Math.random() * wordCount)
    );
    if (!word) return reply.notFound("Word not found");
    const game = await Game.create({ user, word });
    return protect(["word"], game);
  };

  fastify.route({
    method: "POST",
    path: "/games",
    handler: onGameCreate,
    // schema: {
    //   description: "Creates game with random word",
    //   body: S.object().prop("userId", S.string().required()),
    //   headers: authHeaders,
    //   response: { 200: gameSchema.full, 404: errorSchema, 401: errorSchema },
    // },
  });

  const onWordGuess = async (request, reply) => {
    // Find game in database
    const { id } = request.params;
    const game = await Game.findById(id).populate("user");
    console.log(game);
    if (!game) return reply.notFound("Game not found");
    if (game?.isFinished) return reply.notFound("Game is finished");
    // Normalize guess (lowercase)
    const { word, guessed } = game;
    const { guess } = request.body;
    const normalizedGuess = guess.toLowerCase();
    // Check if guess is correct
    const isOneLetter = guess.length === 1;
    const isCorrect =
      normalizedGuess === word ||
      (isOneLetter && word.includes(normalizedGuess));
    const isAlreadyHandled =
      isOneLetter &&
      (game.guessed.includes(guess) || game.mistakes.includes(guess));
    if (isCorrect) {
      if (isOneLetter && !isAlreadyHandled) game.guessed.push(normalizedGuess);
      else game.guessed = unique(normalizedGuess.split(""));
    } else {
      if (isOneLetter && !isAlreadyHandled) game.mistakes.push(normalizedGuess);
      game.attemptsLeft -= 1;
    }
    // Check if game is finished
    const wordUniqueLetters = unique(word.split(""));
    const isWordGuessed = wordUniqueLetters.every((letter) =>
      guessed.includes(letter)
    );
    if (isWordGuessed || game.attemptsLeft === 0) {
      game.isFinished = true;
      game.finishedAt = Date.now();
      game.experience = calculateGameExp(game);
      await addUserExp(game.user, game.experience);
    }
    await game.save();
    return protect(["word"], game);
  };

  fastify.route({
    method: "POST",
    path: "/games/:id/guess",
    handler: onWordGuess,
    // schema: {
    //   description: "Guess the letter or the word in the game",
    //   body: S.object().prop("guess", S.string().required()),
    //   headers: authHeaders,
    //   response: { 200: gameSchema.full, 404: errorSchema, 401: errorSchema },
    // },
  });
};

module.exports = games;
