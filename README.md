# bot-runner

A bot runner to help orchestrate running multiple bots in one instance, for example with [opensea-activity-bot](https://github.com/ryanio/opensea-activity-bot) and [discord-nft-embed-bot](https://github.com/ryanio/discord-nft-embed-bot).

## Setup

### Env

Set `BOT_RUNNER_INSTANCES` to a JSON array that mimics the structure of `env-example.json` with your own variables.

The start command (default: `yarn run start`) will be run in the `node_modules` folder as specified by the key `bot`. To override the default start command, set on the instance key `command` with value e.g. `npm run anotherCommand`.

To generate the string output for `BOT_RUNNER_INSTANCES` in this directory run `node` then `JSON.stringify(require('./env-example.json'))`.

#### Delay

The `delay` parameter is useful for staggering OpenSea requests from multiple activity bots when using the same API key. This can be set to the number of seconds to delay the bot, e.g. `30` to signify a delay of 30 seconds, which would evenly distribute requests between two bots that use the default interval of 60s.

### Run

`yarn start`

#### Running on a server

I recommend to use DigitalOcean over Heroku for improved stability. Heroku servers can restart (cycle) which can lead to duplicate posts since the ephemeral disk is lost.

My preferred setup is a $5/month Basic Droplet with Ubuntu. Install Node v16 and yarn, clone this repo, cd into it, run `yarn`, install [pm2](https://pm2.keymetrics.io/) with `yarn global add pm2`, set env vars, run `pm2 start yarn -- start`. Monitor with `pm2 list` and `pm2 logs`. Add log rotation module to keep default max 10mb of logs with `pm2 install pm2-logrotate`. To respawn after reboot, set your env vars in `/etc/profile`, then run `pm2 startup` and `pm2 save`.

Support this project by using the referral badge below:

[![DigitalOcean Referral Badge](https://web-platforms.sfo2.digitaloceanspaces.com/WWW/Badge%203.svg)](https://www.digitalocean.com/?refcode=3f8c76216510&utm_campaign=Referral_Invite&utm_medium=Referral_Program&utm_source=badge)
