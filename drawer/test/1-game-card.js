'use strict';

const path = require('node:path');
const { createGameCard, getAvatarPath, saveCanvasPNG } = require('../drawer');

const USER_ID = null;
const AVATAR_ID = 2;

(async () => {
  const options = {
    mistakes: ['k', 'c'],
    nickname: 'HangmanDemoUser',
    avatarPath: await getAvatarPath(USER_ID, AVATAR_ID),
    attemptsLeft: 3,
    hangmanType: 4,
    word: 'hangman',
    guessed: ['a', 'h', 'n'],
    locale: 'de',
  };

  const gameCardCanvas = await createGameCard(options);
  await saveCanvasPNG(gameCardCanvas, path.join(__dirname, './results/1-game-card.png'));
})();
