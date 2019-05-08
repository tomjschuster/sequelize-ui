const webpack = require('webpack')
const merge = require('webpack-merge')
const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const common = {
  entry: './src/index.js',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'static/js/app.js'
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['react', 'env'],
          plugins: [
            'transform-object-rest-spread',
            'transform-class-properties'
          ]
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', { loader: 'css-loader' }]
      },
      {
        test: /\.jpe?g$|\.gif$|\.ico$|\.png$|\.svg$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]',
          outputPath: 'static/images'
        }
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          mimetype: 'application/font-woff',
          name: '[name].[ext]?[hash]',
          outputPath: 'static/fonts'
        }
      },
      {
        test: /\.(ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]',
          outputPath: 'static/fonts'
        }
      },
      {
        test: /\.otf(\?.*)?$/,
        loader: 'file-loader',
        options: {
          name: '/fonts/[name].[ext]',
          mimetype: 'application/font-otf',
          outputPath: 'static'
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      filename: 'index.html'
    }),
    new ExtractTextPlugin('[name].[hash].css'),
    new CopyWebpackPlugin([{ from: 'assets', to: './static' }])
  ]
}

const dev = {
  devtool: 'source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development')
    })
  ]
}

const prod = {
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      extractComments: true,
      sourceMap: true
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    })
  ]
}

switch (process.env.NODE_ENV) {
  case 'production':
    module.exports = merge(common, prod)
    break
  case 'development':
    module.exports = merge(common, dev)
    break
  default:
    module.exports = merge(common, dev)
}
