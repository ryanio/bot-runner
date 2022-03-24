import { spawn } from 'child_process'
import { resolve } from 'path'

const { BOT_RUNNER_INSTANCES, DEBUG } = process.env

type BotInstance = {
  name: string // Name to reference the bot in the runner logs
  bot: string // Name of folder in node_modules to run the start command
  command?: string // The command to run in the root of the bot folder. Default: `yarn run start`
  env: { [key: string]: string } // Env vars to set for the instance
  delay?: number // Seconds to delay the start command of the bot. Default: 0
}

const instances: BotInstance[] = JSON.parse(BOT_RUNNER_INSTANCES)
const processes = []
const defaultEnv = {}

if (DEBUG) {
  defaultEnv['DEBUG'] = 'true'
}

const exec = (instance: BotInstance) => {
  instance.command ??= 'yarn run start'
  const [runCmd, ...runOpts] = instance.command.split(' ')
  const p = spawn(runCmd, runOpts, {
    cwd: resolve(__dirname, `../node_modules/${instance.bot}`),
    env: { ...process.env, ...defaultEnv, ...instance.env },
    stdio: 'inherit',
  })
  processes.push(p)
}

async function main() {
  const run = async () => {
    for (const instance of instances) {
      const { delay, bot, name } = instance
      const delayMsg = delay ? ` in ${delay}s` : ''
      console.log(`Starting ${name} (${bot})${delayMsg}...`)
      setTimeout(() => {
        exec(instance)
      }, (delay ?? 0) * 1000)
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
