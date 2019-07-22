#!/usr/bin/env node

const program = require('commander')
const path = require('path')
require('dotenv').config()

program
  .command('start')
  .description('run services, selectively')
  .allowUnknownOption()
  .action(plugin => {
    require('./lib/start')(plugin)
  })

program.parse(process.argv)

if (!process.argv.slice(2).length) {
  program.outputHelp()
}
