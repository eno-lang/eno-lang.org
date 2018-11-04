'use strict';

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');

module.exports = {
  entry: {
    demo: path.resolve(__dirname, 'src/demo/demo.js'),
    index: path.resolve(__dirname, 'src/styles/main.scss')
  },
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      },
      {
        test: /\.(css|scss)$/,
        use: [
          MiniCssExtractPlugin.loader, //'style-loader',
          'css-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.(png|svg|woff|woff2)$/,
         use: 'file-loader'
      }
    ]
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'public')
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'styles.css'
    })
  ]
};
