#!/usr/bin/env node
const cp = require('child_process')
const path = require('path')
const { microfrontends } = require('../../apps')

const children = []

function killall(err) {
  children.forEach(child => {
    if (child.inst) child.inst.kill(err || 0)
  })

  if (err) throw err
}

/**
 * Run the dev scripts of microfrontends
 *
 * @param {Object[]} services list of microservices as they are defined in mf.index.js
 * @param {Object} options
 */
function start(services = microfrontends, { nameFilter } = {}) {
  const svc = [
    ...services
  ]

  svc.filter((item) => {
    if (nameFilter && Array.isArray(nameFilter)) {
      return nameFilter.includes(item.name)
    }

    // fallback
    return item
  }).forEach(mf => {
    const child = {}

    child.inst = cp.spawn(
      'bash',
      [
        '-c',
        `npm run serve`
      ],
      {
        cwd: mf.path,
        stdio: 'inherit'
      }
    )
    child.inst.on('error', killall)
    child.inst.on('close', code => {
      console.log(`\nfinished task ${mf.name} with ${code}`)
      if (code !== 0) {
        killall(new Error('could not complete task. See errors above.'))
      }
    })

    children.push(child)
  })

  process.on('SIGINT', () => {
    killall()

    process.exit(0)
  })

  process.on('exit', (code) => {
    killall()
    process.exit(code)
  })
}

module.exports = start

if (require.main === module) {
  start()
}
