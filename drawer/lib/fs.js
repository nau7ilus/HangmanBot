'use strict';

const fs = require('node:fs');
const fsPromises = require('node:fs/promises');
const path = require('node:path');

async function findImages(prefix = '') {
  const dirPath = path.join(__dirname, './assets', prefix);
  const files = await fsPromises.readdir(dirPath);
  const result = [];
  for await (const file of files) {
    const stats = await fsPromises.lstat(`${dirPath}/${file}`);
    if (!stats?.isDirectory()) continue;
    const directoryImages = await findImages(path.join(prefix, file));
    result.push(...directoryImages);
  }
  const images = files.filter((image) => image.endsWith('.png'));
  const names = images.map((image) => image.slice(0, -4));
  const prefixedNames = prefix ? names.map((n) => `${prefix}/${n}`) : names;
  result.push(...prefixedNames);
  return result;
}

function addPath(prefix, format, paths) {
  const entries = paths.map((p) => [p, path.join(__dirname, prefix, `${p}.${format}`)]);
  return Object.fromEntries(entries);
}

function saveCanvasPNG(canvas, filePath) {
  return new Promise((resolve) => {
    const out = fs.createWriteStream(filePath);
    const stream = canvas.createPNGStream();
    stream.pipe(out);
    out.on('finish', resolve);
  });
}

module.exports = { findImages, addPath, saveCanvasPNG };
