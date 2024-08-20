'use strict';

const path = require('node:path');
const { getAvatarPath, saveCanvasPNG, createWinCard } = require('../drawer');

const USER_ID = null;
const AVATAR_ID = 3;

(async () => {
  const options = {
    nickname: 'HangmanDemoUser',
    avatarPath: await getAvatarPath(USER_ID, AVATAR_ID),
    locale: 'de',
    level: 4,
    exp: 80,
    nextLevelExp: 135,
    points: 50,
    word: 'hangman',
  };

  const gameCardCanvas = await createWinCard(options);
  await saveCanvasPNG(gameCardCanvas, path.join(__dirname, './results/2-win-card.png'));
})();
