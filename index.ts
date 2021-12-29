import { spawn } from 'child_process'
import { resolve } from 'path'

enum Bot {
  OpenseaActivity = 'opensea-activity-bot',
  DiscordNft = 'discord-nft-bot',
}

const { BOT_RUNNER_INSTANCES, DEBUG } = process.env

const instances = JSON.parse(BOT_RUNNER_INSTANCES)
const processes = []
const defaultEnv = {}

if (DEBUG) {
  defaultEnv['DEBUG'] = 'true'
}

const exec = (instance: any) => {
  const { name, bot } = instance

  let cwd = 'node_modules/'

  if (bot === Bot.OpenseaActivity) {
    cwd += 'opensea-activity-bot'
  } else if (bot === Bot.DiscordNft) {
    cwd += 'discord-nft-bot'
  } else {
    console.error(`Unsupported bot type for ${name}: ${bot}`)
    return
  }

  const env = { ...process.env, ...defaultEnv, ...instance.env }
  const p = spawn('yarn', ['run', 'start'], {
    cwd: resolve(__dirname, cwd),
    env,
    stdio: 'inherit',
  })
  processes.push(p)
}

async function main() {
  const run = async () => {
    for (const instance of instances) {
      const { delay, bot, name } = instance
      const delayMsg = delay ? ' in ' + delay + 's' : ''
      console.log(`Starting ${name} (${bot})${delayMsg}...`)
      setTimeout(() => {
        exec(instance)
      }, delay * 1000 ?? 0)
    }
  }

  run()

  process.on('SIGINT', () => {
    console.log('Caught interrupt signal. Stopping...')
    for (const p of processes) {
      p.kill('SIGINT')
    }
    process.exit()
  })
}

main()
