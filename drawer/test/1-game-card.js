'use strict';

const path = require('node:path');
const { createGameCard, saveCanvasPNG, downloadDiscordAvatar } = require('../drawer');

const USER_ID = '876172866897448981';
const AVATAR_ID = '57695c6ec3d9f8f2ede0eb56d4704e6c';

(async () => {
  const options = {
    nickname: 'HangmanDemoUser',
    avatar: await downloadDiscordAvatar(USER_ID, AVATAR_ID),
    word: 'hangman',
    guesses: ['a', 'h', 'n', 'k', 's', 'l'],
    locale: 'de',
  };

  const gameCardCanvas = await createGameCard(options);
  await saveCanvasPNG(gameCardCanvas, path.join(__dirname, './results/1-game-card.png'));
})();
