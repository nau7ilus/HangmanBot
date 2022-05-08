<div align="center">
 
[![hangman logo](https://i.imgur.com/Ibr2LhK.png)](https://github.com/nieopierzony/HangmanBot)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
![Code size](https://img.shields.io/github/languages/code-size/nieopierzony/HangmanBot?style=flat)
[![Last release](https://img.shields.io/github/v/release/nieopierzony/HangmanBot)](https://github.com/nieopierzony/HangmanBot/releases)

</div>

## Description

The implementation of the game [Hangman](<https://en.wikipedia.org/wiki/Hangman_(game)>) in the form of a Discord bot. The main goal of the game is to guess the given word, by one letter with a limited number of attempts.

To display information about the current game uses pictures rather than text. Therefore, the project is divided into two applications: the visualizer and the bot itself. The first one is a web server on **[fastify](https://github.com/fastify/fastify)**, which provides the ability to quickly compose pictures with the needed information and immediately send them to Discord. It uses png blanks and adds the necessary information using **[canvas](https://github.com/Automattic/node-canvas)**.

Bot's task is to create a word, create [private thread](https://support.discord.com/hc/en-us/articles/4403205878423-Threads#h_01FBQZH4F0E9RX2K078Y6EG6QB) for game (available only for servers with 2 level of boost, in the future can be added the ability to create a normal channel), save the state of the game, using **[redis](https://github.com/redis/node-redis)**, check answers of users and set their rating in **PostgreSQL**

## Prerequisites

- [Node.js v16.15.0 LTS](https://nodejs.org/en/download/)
- [PostgreSQL v14.2](https://www.enterprisedb.com/downloads/postgres-postgresql-downloads)
- [Redis](https://redis.io/docs/getting-started/)
- [node-canvas](https://github.com/Automattic/node-canvas) (see [installation](https://github.com/Automattic/node-canvas#compiling) section)

...or if you want to use Docker, then nothing above is required, just

- [Docker Engine](https://docs.docker.com/engine/install/)
- [Docker Composer](https://docs.docker.com/compose/install/)

## Current status

Nothing is ready yet. The focus is on the web server, then the mechanics of the game

## Changelog

If you want to see the history of code changes, check CHANGELOG.md

## Contributors

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

See GitHub to see [contributions list](https://github.com/nieopierzony/HangmanBot/graphs/contributors)

## License

HangmanBot is licensed under [MIT](https://github.com/nieopierzony/HangmanBot/blob/main/LICENSE) license
