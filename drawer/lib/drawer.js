'use strict';

const path = require('node:path');
const { registerFont, createCanvas, loadImage } = require('canvas');
const { findImages, addPath } = require('./fs');
const { isEven, setLetterSpacing, setFontSize, setFontColor, getLines, alignTextByY, roundRect } = require('./util');

const WIDTH = 1200;
const HEIGHT = 800;

const MAX_MISTAKES_WIDTH = 720;
const MISTAKES_FONT_SIZE = 53;
const MISTAKES_COORDS = [72, 420];
const MISTAKES_FONT_COLOR = '#E84141';

const ATTEMPTS_LEFT_FONT_COLOR = '#fff';
const ATTEMPTS_LEFT_FONT_SIZE = 73;
const ATTEMPTS_LEFT_COORDS = [695, 723];

const AVATAR_COORDS = [72, 658];
const AVATAR_MASK_COORDS = [112, 698];
const AVATAR_SIZE = [80, 80];

const NICKNAME_MAX_LENGTH = 20;
const MAX_NICKNAME_WIDTH = 320;
const NICKNAME_FONT_COLOR = '#000';
const NICKNAME_FONT_SIZE = 42;
const GAME_NICKNAME_FONT_SIZE = 32;
const GAME_NICKNAME_COORDS = [175, 710];

const HANGMAN_COORDS = [880, 310];

const CENTER_LETTER_Y = 150;
const TASK_FONT_SIZE = 70;
const TASK_FONT_COLOR = '#FFF';
const TASK_LETTER_WIDTH = 55;
const TASK_LETTER_SPACE = 16;
const TASK_LETTER_OFFSET = 35;
const TASK_UNDERLINE_GREEN_COLOR = '#3FDC4F';
const TASK_UNDERLINE_GREY_COLOR = '#748090';
const TASK_UNDERLINE_RED_COLOR = '#DC3F3F';
const UNDERLINE_OFFSET = 25;

const LOSE_CENTER_LETTER_Y = 435;
const LOSE_TASK_LETTER_WIDTH = 39;
const LOSE_TASK_FONT_SIZE = 50;
const LOSE_TASK_NOT_GUESSED_COLOR = '#747F90';
const LOSE_TASK_LETTER_SPACE = 12;
const LOSE_TASK_LETTER_OFFSET = -140;
const LOSE_UNDERLINE_OFFSET = 15;

const GUESSED_WORD_FONT_SIZE = 66;
const GUESSED_WORD_FONT_COLOR = '#FFF';
const GUESSED_WORD_COORDS = [400, 450];

const POINTS_GREEN = '#3FDC4F';
const POINTS_RED = '#DC3F3F';
const POINTS_FONT_SIZE = 97;
const POINTS_COORDS = [856, 740];

const NICKNAME_COORDS = [182, 690];
const LEVEL_CHORDS = [182, 730];
const RANK_SPACE = 12;
const RANK_FONT_SIZE = 38;
const RANK_FONT_COLOR = '#138CFB';
const RANK_BAR_HEIGHT = 10;
const RANK_BAR_END_X = 650;
const RANK_BAR_Y = 720;
const RANK_BAR_BG_COLOR = '#2A313A';
const RANK_BAR_RADII = 5;

let preloadedImages = null;

async function preload() {
  registerFont(path.join(__dirname, './assets/junegull.ttf'), { family: 'Junegull' });
  const foundImages = addPath('./assets', 'png', await findImages());
  const loadPromises = Object.values(foundImages).map((p) => loadImage(p));
  const loaded = await Promise.all(loadPromises);
  const imagesEntries = Object.keys(foundImages).map((k, i) => [k, loaded[i]]);
  preloadedImages = Object.fromEntries(imagesEntries);
}

async function initCanvas(type, locale) {
  // If the pictures have not loaded yet, do this
  if (!preloadedImages) await preload();
  const canvas = createCanvas(WIDTH, HEIGHT);
  const ctx = canvas.getContext('2d');
  // Set background preset
  const background = preloadedImages[`base/${locale}/${type}Bg`];
  ctx.drawImage(background, 0, 0);
  return { canvas, ctx };
}

function addMistakes(ctx, mistakes) {
  setFontSize(ctx, MISTAKES_FONT_SIZE);
  setFontColor(ctx, MISTAKES_FONT_COLOR);
  const lines = getLines(ctx, mistakes, MAX_MISTAKES_WIDTH);
  const withSpacing = setLetterSpacing(lines, 5);
  ctx.fillText(withSpacing.join('\n'), ...MISTAKES_COORDS);
}

function addNickname(ctx, nickname, isGame = true) {
  const { length } = nickname;
  // If the nickname is too long, cut it
  if (length > NICKNAME_MAX_LENGTH) nickname = `${nickname.substring(0, NICKNAME_MAX_LENGTH)}…`;
  setFontSize(ctx, isGame ? GAME_NICKNAME_FONT_SIZE : NICKNAME_FONT_SIZE);
  setFontColor(ctx, NICKNAME_FONT_COLOR);
  // Wrap the nickname in 2 lines
  const lines = getLines(ctx, nickname, MAX_NICKNAME_WIDTH, '');
  // Nickname must be aligned with the avatar
  let [x, y] = isGame ? GAME_NICKNAME_COORDS : NICKNAME_COORDS;
  if (isGame) y = alignTextByY(lines, NICKNAME_FONT_SIZE, y);
  ctx.fillText(isGame ? lines.join('\n') : nickname, x, y);
}

async function addAvatar(ctx, avatar) {
  // Create circular clipping region
  ctx.beginPath();
  ctx.arc(...AVATAR_MASK_COORDS, 40, 0, Math.PI * 2);
  ctx.clip();
  // Draw avatar image inside
  const avatarImage = await loadImage(avatar);
  ctx.drawImage(avatarImage, ...AVATAR_COORDS, ...AVATAR_SIZE);
  ctx.closePath();
}

function setAttemptsLeft(ctx, attemptsLeft) {
  setFontColor(ctx, ATTEMPTS_LEFT_FONT_COLOR);
  setFontSize(ctx, ATTEMPTS_LEFT_FONT_SIZE);
  ctx.fillText(attemptsLeft, ...ATTEMPTS_LEFT_COORDS);
}

function addHangman(ctx, type) {
  const hangman = preloadedImages[`sprites/${type}`];
  ctx.drawImage(hangman, ...HANGMAN_COORDS);
}

function addWord(ctx, word, guessed = guessed.toLowerCase(), isLose = false) {
  setFontSize(ctx, isLose ? LOSE_TASK_FONT_SIZE : TASK_FONT_SIZE);
  ctx.textAlign = 'center';
  // Calculate the first letter's coordinates
  const letterWidth = isLose ? LOSE_TASK_LETTER_WIDTH : TASK_LETTER_WIDTH;
  const centerX = isEven(word.length) ? WIDTH / 2 : WIDTH / 2 - letterWidth / 2;
  const centerLetterIndex = Math.floor(word.length / 2);
  const beforeCenter = word.substring(0, centerLetterIndex);
  const letterSpace = isLose ? LOSE_TASK_LETTER_SPACE : TASK_LETTER_SPACE;
  const startX = centerX - beforeCenter.length * (letterWidth + letterSpace);
  // Draw every letter
  const centerY = isLose ? LOSE_CENTER_LETTER_Y : CENTER_LETTER_Y;
  for (const [i, letter] of Object.entries(word.split(''))) {
    // Calculate the offset for the letter to the first one
    const startOffset = i * (letterWidth + letterSpace);
    const letterOffset = isLose ? LOSE_TASK_LETTER_OFFSET : TASK_LETTER_OFFSET;
    const x = startX + startOffset + letterOffset;
    const isGuessed = guessed.includes(letter.toLowerCase());
    // Draw the letter only if guessed
    if (isGuessed || isLose) {
      if (isLose && !isGuessed) setFontColor(ctx, LOSE_TASK_NOT_GUESSED_COLOR);
      else setFontColor(ctx, TASK_FONT_COLOR);
      ctx.fillText(letter, x, centerY);
    }
    // Draw the underline
    const redOrGrey = isLose ? TASK_UNDERLINE_RED_COLOR : TASK_UNDERLINE_GREY_COLOR;
    const underlineColor = isGuessed ? TASK_UNDERLINE_GREEN_COLOR : redOrGrey;
    setFontColor(ctx, underlineColor);
    const underlineOffset = isLose ? LOSE_UNDERLINE_OFFSET : UNDERLINE_OFFSET;
    ctx.fillText('_', x, centerY + underlineOffset);
  }
  // Reset text alignment
  ctx.textAlign = 'left';
}

async function createGameCard({ mistakes, nickname, avatar, attemptsLeft, hangmanType, word, guessed, locale }) {
  const { canvas, ctx } = await initCanvas('game', locale);
  addMistakes(ctx, mistakes.join(' '));
  addNickname(ctx, nickname);
  setAttemptsLeft(ctx, attemptsLeft);
  addHangman(ctx, hangmanType);
  addWord(ctx, word, guessed);
  await addAvatar(ctx, avatar);
  return canvas;
}

function addGuessedWord(ctx, word) {
  ctx.textAlign = 'center';
  setFontSize(ctx, GUESSED_WORD_FONT_SIZE);
  setFontColor(ctx, GUESSED_WORD_FONT_COLOR);
  ctx.fillText(word, ...GUESSED_WORD_COORDS);
  ctx.textAlign = 'left';
}

function addPoints(ctx, points) {
  const sign = points >= 0 ? '+' : '';
  const color = points >= 0 ? POINTS_GREEN : POINTS_RED;
  setFontColor(ctx, color);
  setFontSize(ctx, POINTS_FONT_SIZE);
  ctx.fillText(`${sign}${points}`, ...POINTS_COORDS);
}

function addRankInfo(ctx, level, exp, nextLevelExp) {
  // Draw current level
  setFontSize(ctx, RANK_FONT_SIZE);
  setFontColor(ctx, RANK_FONT_COLOR);
  ctx.fillText(`${level} LVL`, ...LEVEL_CHORDS);
  // Draw rank bar
  const levelTextWidth = ctx.measureText(`${level} LVL`).width;
  const barStartX = LEVEL_CHORDS[0] + levelTextWidth + RANK_SPACE;
  const outsideBarWidth = RANK_BAR_END_X - barStartX;
  const expPercent = (exp * 100) / nextLevelExp;
  const pxPerPercent = outsideBarWidth / 100;
  const barWidth = pxPerPercent * expPercent;
  setFontColor(ctx, RANK_BAR_BG_COLOR);
  roundRect(ctx, barStartX, RANK_BAR_Y, outsideBarWidth, RANK_BAR_HEIGHT, RANK_BAR_RADII);
  setFontColor(ctx, RANK_FONT_COLOR);
  roundRect(ctx, barStartX, RANK_BAR_Y, barWidth, RANK_BAR_HEIGHT, RANK_BAR_RADII);
}

async function createWinCard({ nickname, avatar, locale, level, exp, nextLevelExp, points, word }) {
  const { canvas, ctx } = await initCanvas('win', locale);
  addRankInfo(ctx, level, exp, nextLevelExp);
  addPoints(ctx, points);
  addGuessedWord(ctx, word);
  addNickname(ctx, nickname, false);
  await addAvatar(ctx, avatar);
  return canvas;
}

async function createLoseCard({ nickname, avatar, locale, level, exp, nextLevelExp, points, word, guessed }) {
  const { canvas, ctx } = await initCanvas('lose', locale);
  addRankInfo(ctx, level, exp, nextLevelExp);
  addPoints(ctx, points);
  addNickname(ctx, nickname, false);
  addWord(ctx, word, guessed, true);
  await addAvatar(ctx, avatar);
  return canvas;
}

module.exports = { createGameCard, createWinCard, createLoseCard };
