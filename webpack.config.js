'use strict';

const path = require('path');

module.exports = {
  entry: path.resolve(__dirname, 'src/demo/demo.js'),
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
    filename: 'demo.js',
    path: path.resolve(__dirname, 'public')
  }
};
