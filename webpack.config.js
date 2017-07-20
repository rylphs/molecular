var path = require('path')
var webpack = require('webpack')
var fs = require('fs');

const PATHS = {
  src: path.join(__dirname, './src'),
  build: path.join(__dirname, './build')
}

module.exports = {
  "node": {
    fs: "empty",
    global: true,
    crypto: "empty",
    tls: "empty",
    net: "empty",
    process: true,
    module: false,
    clearImmediate: false,
    setImmediate: false,
    __dirname: false,
    __filename: false
  },

  "externals": ['@angular/core', 'electron', 'reflect-metadata', 'rxjs/Subject']
   // "reflect-metadata": "reflect-metadata"
  ,

  entry: {
    'main': PATHS.src + '/main.ts',
    'renderer': PATHS.src + '/renderer.ts',
  },
  output: {
    path: PATHS.build,
    filename: '[name].js',
    library: 'molecular',
    libraryTarget: 'umd'
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.ts$/,
        
        loader: 'awesome-typescript-loader',
         options: {
          useTranspileModule: true
        },
      }
    ],
  },
  resolve: {
    // you can now require('file') instead of require('file.js')
    extensions: ['.ts', '.js']
  },
  plugins: [
    new webpack.IgnorePlugin(/test\.ts$/),
    /*new webpack.optimize.CommonsChunkPlugin({
      name: 'shared',
      minChunks: ({ resource }) => /shared/.test(resource),
      chunks: ["main", "renderer"]
    }),*/
    new webpack.ProgressPlugin()
  ]
}
