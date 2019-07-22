
module.exports = {
  transpileDependencies: [

  ],
  pluginOptions: {
  },
  configureWebpack: {
    devtool: 'source-map',
    plugins: []
  },
  chainWebpack: config => config.resolve.symlinks(false),
  devServer: {
    port: 8081
  }
}
