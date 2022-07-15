'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { promisify } = require('node:util');

const readDirectory = promisify(fs.readdir);
const readFile = promisify(fs.readFile);
const lstat = promisify(fs.lstat);
const writeFile = promisify(fs.writeFile);
const exists = promisify(fs.exists);

const findImages = async (prefix = '') => {
  const dirPath = path.join(__dirname, './assets', prefix);
  const files = await readDirectory(dirPath);
  const result = [];
  for await (const file of files) {
    const stats = await lstat(`${dirPath}/${file}`);
    if (!stats?.isDirectory()) continue;
    const directoryImages = await findImages(path.join(prefix, file));
    result.push(...directoryImages);
  }
  const images = files.filter((image) => image.endsWith('.png'));
  const names = images.map((image) => image.slice(0, -4));
  const prefixedNames = prefix ? names.map((n) => `${prefix}/${n}`) : names;
  result.push(...prefixedNames);
  return result;
};

const addPath = (prefix, format, paths) => {
  const entries = paths.map((p) => [p, path.join(__dirname, prefix, `${p}.${format}`)]);
  return Object.fromEntries(entries);
};

const saveCanvasPNG = (canvas, filePath) =>
  new Promise((resolve) => {
    const out = fs.createWriteStream(filePath);
    const stream = canvas.createPNGStream();
    stream.pipe(out);
    out.on('finish', resolve);
  });

module.exports = { readDirectory, readFile, lstat, writeFile, exists, findImages, addPath, saveCanvasPNG };
