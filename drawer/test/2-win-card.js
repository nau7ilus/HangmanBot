'use strict';

const path = require('node:path');
const { downloadDiscordAvatar, saveCanvasPNG, createWinCard } = require('../drawer');

const USER_ID = '876172866897448981';
const AVATAR_ID = '57695c6ec3d9f8f2ede0eb56d4704e6c';

(async () => {
  const options = {
    nickname: 'HangmanDemoUser',
    avatar: await downloadDiscordAvatar(USER_ID, AVATAR_ID),
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
