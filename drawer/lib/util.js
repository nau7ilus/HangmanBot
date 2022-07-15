'use strict';

const TEXT_LETTER_SPACE = 10;

const isEven = (n) => n % 2 === 0;

const fillString = (symbol, count) => Array(count).fill(symbol).join('');

const setFontSize = (ctx, fontSize, fontFamily = 'Junegull') => (ctx.font = `${fontSize}px ${fontFamily}`);

const setFontColor = (ctx, fontColor) => (ctx.fillStyle = fontColor);

const getLines = (ctx, text, maxWidth, splitter = ' ') => {
  const words = text.split(splitter);
  const lines = [];
  let currentLine = [];
  for (const word of words) {
    const { width } = ctx.measureText([...currentLine, word].join(splitter));
    if (width > maxWidth) {
      lines.push(currentLine);
      currentLine = [word];
      continue;
    }
    currentLine.push(word);
  }
  lines.push(currentLine);
  return lines.map((l) => l.join(splitter));
};

const alignTextByY = (lines, fontSize, y) => y - (lines.length - 1) * (fontSize - TEXT_LETTER_SPACE);

const setLetterSpacing = (lines = [], step = 1) =>
  lines.map((l) => l.split(' ').join(fillString(String.fromCharCode(8202), step)));

const roundRect = (ctx, x, y, width, height, radius) => {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  ctx.fill();
};

module.exports = {
  isEven,
  fillString,
  setFontSize,
  setFontColor,
  getLines,
  alignTextByY,
  setLetterSpacing,
  roundRect,
};
