'use strict';

const fs = require('node:fs');
const fsPromises = require('node:fs/promises');
const path = require('node:path');

const CACHE_PATH = '.cache/avatars';

// An avatar URL should look like this:
// https://cdn.discordapp.com/avatars/{USER_ID}/{AVATAR_ID}.png?size=64
// which can be easily created via
// discord.js::GuildMember.displayAvatarURL({ extension: 'png', size: 64 })
const downloadDiscordAvatar = async (avatarURL) => {
  // For caching purpuses the avatar ID is being extracted from the provided URL
  avatarURL = new URL(avatarURL);
  const avatarId = path.basename(avatarURL.pathname, `.png`);

  const cachedFilePath = path.join(CACHE_PATH, `${avatarId}.png`);
  const isCached = fs.existsSync(cachedFilePath);

  if (!isCached) {
    await downloadImage(avatarURL, cachedFilePath);
  }

  return fsPromises.readFile(cachedFilePath);
};

const downloadImage = async (url, saveFilePath) => {
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
};

module.exports = { downloadImage, downloadDiscordAvatar };
