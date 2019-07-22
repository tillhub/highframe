const path = require('path')

module.exports = {
  options: {
    enabled: true
  },
  microfrontends: [
    {
      name: 'main',
      path: path.join(__dirname, 'main'),
      target: path.join(__dirname, 'build/static'),
      enabled: true
    },
    {
      name: 'vue-simple-spa',
      path: path.join(__dirname, 'vue-simple-spa'),
      target: path.join(__dirname, 'build/static'),
      enabled: true
    }
  ]
}
