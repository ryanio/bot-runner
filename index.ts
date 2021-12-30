import { spawn } from 'child_process'
import { resolve } from 'path'

const { BOT_RUNNER_INSTANCES, DEBUG } = process.env

const instances = JSON.parse(BOT_RUNNER_INSTANCES)
const processes = []
const defaultEnv = {}

if (DEBUG) {
  defaultEnv['DEBUG'] = 'true'
}

const exec = (instance: any) => {
  const p = spawn('yarn', ['run', 'start'], {
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
