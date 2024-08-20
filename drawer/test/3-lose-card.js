'use strict';

const path = require('node:path');
const { getAvatarPath, saveCanvasPNG, createLoseCard } = require('../drawer');

const USER_ID = null;
const AVATAR_ID = 3;

(async () => {
  const options = {
    nickname: 'HangmanDemoUser',
    avatarPath: await getAvatarPath(USER_ID, AVATAR_ID),
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
