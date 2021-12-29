# bot-runner

A bot runner to help orchestrate running multiple bots in one instance, for example with [opensea-activity-bot](https://github.com/ryanio/opensea-activity-bot) and [discord-nft-bot](https://github.com/ryanio/discord-nft-bot).

## Setup

### Env

Set `BOT_RUNNER_INSTANCES` to a JSON array that mimics the structure of `env-example.json` with your own variables.

To generate the string output for `BOT_RUNNER_INSTANCES` in this directory run `node` then `JSON.stringify(require('./env-example.json'))`.

#### Delay

The `delay` parameter is useful for staggering OpenSea requests from multiple activity bots when using the same API key. This can be set to the number of seconds to delay the bot, e.g. `30` to signify a delay of 30 seconds, which would evenly distribute requests between two bots that use the default interval of 60s.

### Run

`yarn start`

#### Heroku

A `Procfile` is included for easy use on platforms like Heroku.

Clone this repo, push it to heroku, set up the environment variables above, and spin up a worker with `heroku ps:scale web=0 worker=1`

Then watch the logs with `heroku logs --tail`
