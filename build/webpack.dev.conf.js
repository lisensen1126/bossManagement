'use strict'
const path = require('path')
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin')
const portfinder = require('portfinder')
const happypackPlugins = require('./happypack')
var fs = require('fs')
const open = require('opn')

const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)

const devWebpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap, usePostCSS: true })
  },
  // cheap-module-eval-source-map is faster for development
  devtool: config.dev.devtool,

  // these devServer options should be customized in /config/index.js
  devServer: {
    clientLogLevel: 'warning',
    historyApiFallback: true,
    hot: true,
    compress: true,
    host: HOST || config.dev.host,
    port: PORT || config.dev.port,
    open: config.dev.autoOpenBrowser,
    overlay: config.dev.errorOverlay
      ? { warnings: false, errors: true }
      : false,
    publicPath: config.dev.assetsPublicPath,
    proxy: config.dev.proxyTable,
    quiet: true, // necessary for FriendlyErrorsPlugin
    watchOptions: {
      poll: config.dev.poll,
    },
    after () {
      open(`http://localhost:${process.env.PORT || config.dev.port}/?`)
    },
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': require('../config/dev.env')
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
    new webpack.NoEmitOnErrorsPlugin(),
    ...happypackPlugins,
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      favicon: path.resolve(__dirname, '../src/assets/favicon.ico'),
      inject: true,
      inline: [
        fs.readFileSync('src/detect.js'),
      ],
    }),
    new HtmlWebpackPlugin({
      filename: 'legasy.html',
      template: './src/detect/legasy.html',
      inline: [
        fs.readFileSync('src/detect.js'),
        fs.readFileSync('src/detect/init.js'),
        fs.readFileSync('src/detect/detect.css'),
      ],
    }),
    new HtmlWebpackPlugin({
      filename: 'legasy-download.html',
      template: './src/detect/legasy-download.html',
      inline: [
        fs.readFileSync('src/detect.js'),
        fs.readFileSync('src/detect/init.js'),
        fs.readFileSync('src/detect/detect.css'),
      ],
    }),
    new HtmlWebpackPlugin({
      filename: 'browser.html',
      template: './src/detect/browser.html',
      inline: [
        fs.readFileSync('src/detect.js'),
        fs.readFileSync('src/detect/init.js'),
        fs.readFileSync('src/detect/detect.css'),
      ],
    }),
    new HtmlWebpackPlugin({
      filename: 'browser-download.html',
      template: './src/detect/browser-download.html',
      inline: [
        fs.readFileSync('src/detect.js'),
        fs.readFileSync('src/detect/init.js'),
        fs.readFileSync('src/detect/detect.css'),
      ],
    }),
    new HtmlWebpackInlineSourcePlugin(),
  ]
})

module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = process.env.PORT || config.dev.port
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
      // publish the new Port, necessary for e2e tests
      process.env.PORT = port
      // add port to devServer config
      devWebpackConfig.devServer.port = port

      // Add FriendlyErrorsPlugin
      devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
        compilationSuccessInfo: {
          messages: [`Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`],
        },
        onErrors: config.dev.notifyOnErrors
        ? utils.createNotifierCallback()
        : undefined
      }))

      resolve(devWebpackConfig)
    }
  })
})
