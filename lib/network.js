'use strict';

const { writeFile, exists, readFile } = require('./fs');

const DEFAULT_AVATARS_PATH = './lib/assets/defaultAvatars';
const CACHED_AVATARS_PATH = './.cache/avatars';

const buildAvatarUrl = (userId, avatarId) => `https://cdn.discordapp.com/avatars/${userId}/${avatarId}.png?size=64`;

// TODO: Guild user avatars
const getAvatarPath = async (userId, avatarId) => {
  if (avatarId.length === 1) return readFile(`${DEFAULT_AVATARS_PATH}/${avatarId}.png`);
  const avatarPath = `${CACHED_AVATARS_PATH}/${avatarId}.png`;
  const isCached = await exists(avatarPath);
  const avatarUrl = buildAvatarUrl(userId, avatarId);
  if (!isCached) await downloadImage(avatarUrl, avatarPath);
  return avatarPath;
};

const downloadImage = async (url, filePath) => {
  const res = await fetch(url);
  const buffer = Buffer.from(await res.arrayBuffer());
  if (filePath) await writeFile(filePath, buffer);
  return buffer;
};

module.exports = { downloadImage, getAvatarPath };
