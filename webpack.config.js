var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var webpack = require('webpack');
var config = require('./package').config;

var DEBUG = process.env.NODE_ENV !== 'production';

var BUILD_PATH = path.resolve('./assets');

var entry = {
  main: [
    './main.js'
  ]
};

var cssLoader;
var scssLoader;
var fileLoader = 'file-loader?name=[path][name].[ext]';
var htmlLoader = [
  'file-loader?name=[path][name].html',
].join('!');

var plugins = [
  new webpack.optimize.OccurenceOrderPlugin(true),
  new webpack.ProvidePlugin({
    '_': 'lodash',
    // moment: 'moment',
  }),
  new webpack.NoErrorsPlugin()
];

if (DEBUG) {
  entry.main.push('webpack-dev-server/client?http://localhost:' + config.webpackPort);

  cssLoader = 'style!css';
  scssLoader = 'style!css!sass';

} else {
  cssLoader = ExtractTextPlugin.extract('css');
  scssLoader = ExtractTextPlugin.extract('css!sass');

  plugins.unshift(new ExtractTextPlugin('app.css', {allChunks: true}));
}

module.exports = {
  context: path.resolve(__dirname, 'client'),
  cache: DEBUG,
  debug: DEBUG,
  target: 'web',
  entry: entry,
  module: {
    loaders: [
      {
        test: /\.js?$/,
        loaders: ['babel?presets[]=es2015'],
        include: path.resolve(__dirname, 'client')
      }, {
        test: /\.css$/,
        loader: cssLoader
      }, {
        test: /\.scss$/,
        loader: scssLoader
      }, {
        test: /\.jpe?g$|\.gif$|\.png$|\.ico|\.svg$|\.woff$|\.ttf$|\.mp3$/,
        loader: fileLoader
      }, {
        test: /\.html$/,
        loader: htmlLoader
      }
    ]
  },
  plugins: plugins,
  resolve: {
    extensions: ['', '.js']
  },
  output: {
    path: BUILD_PATH,
    publicPath: '/',
    filename: '[name].js'
  },
  devServer: {
    contentBase: BUILD_PATH,
    noInfo: false,
    inline: true,
    stats: { colors: true }
  }
};
