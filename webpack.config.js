module.exports = {
  entry: './src/index.js',
  output: {
    path: __dirname,
    filename: './dist/app.js'
  },
  context: __dirname,
  devtool: 'eval',
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: '/node_modules',
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2015', 'stage-0']
        }
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
              importLoaders: 1,
              localIdentName: '[name]--[local]--[hash:base64:8]'
            }
          },
          'postcss-loader' // postcss.config.js
        ]
      }
    ]
  }
}
