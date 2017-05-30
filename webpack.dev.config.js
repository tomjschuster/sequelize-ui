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
    filename: 'app.dev.js',
    publicPath: '/public/'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      title: 'DEV - Sequelize UI',
      filename: 'index.dev.html',
      template: 'assets/index.hbs',
      inject: false,
      appFilePath: '/app.dev.js'
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
              localIdentName: "[name]--[local]--[hash:base64:8]",
              camelCase: true
            }
          },
          'postcss-loader'
        ]
      }
    ]
  }
}

