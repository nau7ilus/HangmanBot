'use strict';

const path = require('node:path');
const { downloadDiscordAvatar, saveCanvasPNG, createLoseCard } = require('../drawer');

const AVATAR_URL = 'https://cdn.discordapp.com/avatars/876172866897448981/57695c6ec3d9f8f2ede0eb56d4704e6c.png?size=64';

(async () => {
  const options = {
    nickname: 'HangmanDemoUser',
    avatar: await downloadDiscordAvatar(AVATAR_URL),
    locale: 'de',
    level: 1,
    exp: 30,
    nextLevelExp: 100,
    points: -340,
    word: 'hangman',
    guessed: ['h', 'n'],
  };

  const gameCardCanvas = await createLoseCard(options);
  await saveCanvasPNG(gameCardCanvas, path.join(__dirname, './results/3-lose-card.png'));
})();
