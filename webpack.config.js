'use strict';

let path = require('path');

module.exports = {
  entry: {
    main: path.resolve('./src/main.js')
  },
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
    filename: 'bundle.js',
    path: path.resolve('./public')
  }
};
