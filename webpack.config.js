'use strict';

let path = require('path');

module.exports = {
  entry: {
    main: path.resolve('./src/demo/demo.js')
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
    filename: 'demo.js',
    path: path.resolve('./public/demo/')
  }
};
