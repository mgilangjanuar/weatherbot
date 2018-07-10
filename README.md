# Weather Bot
Just simple example of flex message from LINE Messaging API with Redis for caching state. This bot using [OpenWeatherMap](https://openweathermap.org) for data source of weather forecast.

![Forecast GIF](./forecast.gif)

## Table of Contents
 1. [Requirements](#requirements)
 1. [Preparation](#preparation)
 1. [Get Started](#get-started)
 1. [Folder Structure](#folder-structure)
 1. [Available Commands](#available-commands)
 1. [How to Contribute](#how-to-contribute)
 1. [License](#license)

## Requirements
 - Node.js >= v8 ([https://nodejs.org](https://nodejs.org))
 - Redis ([https://redis.io](https://redis.io))
 - 2 chicken burgers from McDonald's with extra cheese

## Preparation
 - Create and define `.env` file based on [`.env.example`](./env.example)
 - Create [LINE Messaging API](https://developers.line.me/en), get the channel secret and channel access token in Channel settings tab and put that in `.env`
 - Create account or login in [OpenWeatherMap](https://openweathermap.org), get the API key and put that in `.env`
 - Run your Redis server

## Get Started
 - Run `npm install` for install all dependencies
 - Run `npm run serve` for development or `npm start` for production phase
 - Publish or deploy webhook and update the Webhook URL field in your settings of LINE Messaging API.

NOTE. Just take a look `/src/controllers` directory and `/src/chatbot.js` module if you want update/add something.

## Folder Structure
```
/dist             # scripts that have been built
/src
  /controllers    # all functional commands
  /utils          # maybe you need this ¯\_(ツ)_/¯
  chatbot.js      # main module for chatbot
  index.js        # main routing app
```

## Available Commands
 - `/start`: View all menu in bot
 - `/current`: View current weather based on specific location
 - `/forecast`: View forecast weather based on specific location

## How to Contribute
 - Create an issue
 - Fork this repository to your GitHub account
 - Make changes
 - Create pull request to this repository

## License
[MIT](./LICENSE.md)

![MIT](https://camo.githubusercontent.com/4b87deb1e6a0319f8b3979ece5337e326ce8b22b/68747470733a2f2f6d656469612e67697068792e636f6d2f6d656469612f4a685468624f71363276776e362f67697068792e676966)