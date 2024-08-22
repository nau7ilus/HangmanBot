'use strict';

const fs = require('node:fs');
const fsPromises = require('node:fs/promises');
const path = require('node:path');

const CACHE_PATH = '.cache/avatars';
const DEFAULT_AVATAR_PATH = 'lib/assets/defaultAvatars';

function calculateUserDefaultAvatarIndex(userId) {
  return Number(BigInt(userId) >> 22n) % 6;
}

function buildAvatarUrl(userId, avatarId) {
  return `https://cdn.discordapp.com/avatars/${userId}/${avatarId}.png?size=64`;
}

async function downloadDiscordAvatar(userId, avatarId) {
  if (!avatarId) {
    const defaultAvatarIndex = calculateUserDefaultAvatarIndex(userId);
    const defaultAvatarFilePath = path.join(DEFAULT_AVATAR_PATH, `${defaultAvatarIndex}.png`);
    return fsPromises.readFile(defaultAvatarFilePath);
  }

  const cachedFilePath = path.join(CACHE_PATH, `${avatarId}.png`);
  const isCached = fs.existsSync(cachedFilePath);

  if (!isCached) {
    const avatarURL = buildAvatarUrl(userId, avatarId);
    await downloadImage(avatarURL, cachedFilePath);
  }

  return fsPromises.readFile(cachedFilePath);
}

async function downloadImage(url, saveFilePath) {
  const res = await fetch(url);
  const buffer = Buffer.from(await res.arrayBuffer());

  if (saveFilePath) {
    const directory = path.dirname(saveFilePath);
    if (!fs.existsSync(directory)) {
      await fsPromises.mkdir(directory, { recursive: true });
    }

    await fsPromises.writeFile(saveFilePath, buffer);
  }

  return buffer;
}

module.exports = { downloadImage, downloadDiscordAvatar };
