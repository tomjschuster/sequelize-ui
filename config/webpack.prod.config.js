'use strict'
const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  devtool: 'source-map',
  entry: [
    path.join(__dirname, '..', 'app', 'index')
  ],
  output: {
    path: path.join(__dirname, '..', 'public'),
    filename: 'app.js',
    publicPath: '/public/'
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.css', '.hbs'],
    modules: [path.join(__dirname, '..', 'app'), 'node_modules']
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      minimize: true,
      compress: {
        warnings: false
      }
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new HtmlWebpackPlugin({
      title: 'Sequelize UI',
      filename: 'index.html',
      template: 'assets/index.hbs',
      inject: false,
      appFilePath: '/app.js'
    })
  ],
  module: {
    rules: [
      {
        test: /\.hbs$/,
        use: ['handlebars-loader']
      },
      {
        test: /\.js$/,
        exclude: path.join(__dirname, '..', 'node_modules'),
        include: path.join(__dirname, '..', 'app'),
        use: [
          {
            loader: 'babel-loader',
            options: {
              extends: path.join(__dirname, '.babelrc')
            }
          }
        ],
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
              sourceMap: true,
              importLoaders: 1,
              localIdentName: '[name]--[local]--[hash:base64:8]',
              camelCase: true
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              config: { path: path.join(__dirname, 'postcss.config.js') }
            }
          }
        ]
      }
    ]
  }
}

