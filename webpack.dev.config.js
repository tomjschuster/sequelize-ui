const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  devtool: 'eval',
  entry: [
    'webpack-hot-middleware/client',
    './src/index'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'app.js',
    publicPath: '/public/'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      title: process.env.NODE_ENV === 'development' ?
        'DEV - Sequelize UI' : 'Sequelize UI',
      filename: 'index.html',
      template: 'assets/index.hbs',
      inject: false
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
        exclude: path.join(__dirname, 'node_modules'),
        include: path.join(__dirname, 'src'),
        use: ['babel-loader']
      }
    ]
  }
}

