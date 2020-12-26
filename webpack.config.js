const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const RobotstxtPlugin = require('robotstxt-webpack-plugin')
const SitemapPlugin = require('sitemap-webpack-plugin').default

const production = process.env.NODE_ENV === 'production'

const alias = production ? {} : { 'react-dom': '@hot-loader/react-dom' }

module.exports = {
  entry: ['core-js/features/array/flat-map', './src/index.js'],
  output: {
    path: path.resolve(__dirname, 'dist/'),
    filename: 'static/[name].[fullhash].js'
  },
  resolve: { extensions: ['.js', '.jsx'], alias },
  devtool: production ? 'source-map' : 'eval-source-map',
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', { useBuiltIns: 'entry', corejs: 3 }],
              '@babel/preset-react'
            ],
            plugins: ['@babel/plugin-proposal-class-properties']
          }
        }
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '../'
            }
          },
          {
            loader: 'css-loader',
            options: { importLoaders: 1 }
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                ident: 'postcss',
                plugins: ['autoprefixer']
              }
            }
          }
        ]
      },
      {
        test: /\.jpe?g$|\.gif$|\.ico$|\.png$|\.svg$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          outputPath: 'static/images'
        }
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          mimetype: 'application/font-woff',
          name: '[name].[ext]',
          outputPath: 'static/fonts'
        }
      },
      {
        test: /\.(ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
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
    new MiniCssExtractPlugin({ filename: 'static/[name].[fullhash].css' }),
    new CopyPlugin({ patterns: [{ from: 'assets', to: 'static' }] }),
    new RobotstxtPlugin(),
    new SitemapPlugin({
      base: 'https://sequelizeui.app',
      paths: ['/'],
      options:{ lastMod: true }
    })
  ]
}
