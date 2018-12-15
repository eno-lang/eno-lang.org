'use strict';

const path = require('path');

module.exports = {
  devtool: 'source-map',
  entry: {
    demo: path.resolve(__dirname, 'src/demo/libraries.js'),
    try: path.resolve(__dirname, 'src/demo/language.js')
  },
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      }
    ]
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'public')
  }
};
