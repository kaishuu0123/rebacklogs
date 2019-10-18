process.env.NODE_ENV = process.env.NODE_ENV || 'production'

const environment = require('./environment')

const TerserPlugin = require('terser-webpack-plugin')

environment.config.optimization.minimizer.forEach(function(minimizer) {
  if(minimizer instanceof TerserPlugin) {
    minimizer.options.parallel = false
  }
})

module.exports = environment.toWebpackConfig()
