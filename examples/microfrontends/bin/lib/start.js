const inquirer = require('inquirer')
const mfs = require('../../apps')
const start = require('./dev')
// const dev = require('../../microfrontends/dev')

const defaultChoices = [
  ...mfs.microfrontends.map(item => {
    return {
      name: item.name,
      checked: item.enabled || false
    }
  })
]

module.exports = async function (plugins) {
  if (process.argv.includes('--all')) {
    return start(undefined, { nameFilter: defaultChoices.map((item) => (item.name)) })
  }

  const { services } = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'services',
      message: 'Which services do you want to run?',
      choices: defaultChoices.map((item) => {
        return item
      })
    }
  ])

  start(undefined, { nameFilter: services })
}
