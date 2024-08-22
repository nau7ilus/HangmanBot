'use strict';

const TEXT_LETTER_SPACE = 10;

function isEven(n) {
  return n % 2 === 0;
}

function fillString(symbol, count) {
  return Array(count).fill(symbol).join('');
}

function setFontSize(ctx, fontSize, fontFamily = 'Junegull') {
  ctx.font = `${fontSize}px ${fontFamily}`;
}

function setFontColor(ctx, fontColor) {
  ctx.fillStyle = fontColor;
}

function getLines(ctx, text, maxWidth, splitter = ' ') {
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
}

function alignTextByY(lines, fontSize, y) {
  return y - (lines.length - 1) * (fontSize - TEXT_LETTER_SPACE);
}

function setLetterSpacing(lines = [], step = 1) {
  const THIN_SPACE_UTF16 = String.fromCharCode(8202);
  const space = fillString(THIN_SPACE_UTF16, step);

  const result = [...lines];
  for (let i = 0; i < result.length; i++) {
    const words = result[i].split(' ');
    result[i] = words.join(space);
  }

  return result;
}

function roundRect(ctx, x, y, width, height, radius) {
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
}

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
