const HappyPack = require('happypack')
const vueLoaderConfig = require('./vue-loader.conf')

module.exports = [
  new HappyPack({
    id: 'vue',
    loaders: [{
      loader: 'vue-loader',
      options: vueLoaderConfig,
    }],
  }),
  new HappyPack({
    id: 'babel',
    loaders: ['babel-loader'],
  }),
]
