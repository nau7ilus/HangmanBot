'use strict';

const path = require('node:path');
const { createGameCard, saveCanvasPNG, downloadDiscordAvatar } = require('../drawer');

const AVATAR_URL = 'https://cdn.discordapp.com/avatars/876172866897448981/57695c6ec3d9f8f2ede0eb56d4704e6c.png?size=64';

(async () => {
  const options = {
    mistakes: ['k', 'c'],
    nickname: 'HangmanDemoUser',
    avatar: await downloadDiscordAvatar(AVATAR_URL),
    attemptsLeft: 3,
    hangmanType: 4,
    word: 'hangman',
    guessed: ['a', 'h', 'n'],
    locale: 'de',
  };

  const gameCardCanvas = await createGameCard(options);
  await saveCanvasPNG(gameCardCanvas, path.join(__dirname, './results/1-game-card.png'));
})();
