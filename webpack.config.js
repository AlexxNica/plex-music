const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { productName, dependencies } = require('./package.json')

const extractCSS = new ExtractTextPlugin('renderer.css')

const cssLoaders = ['css-loader?modules&sourceMap&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]', 'postcss-loader']

module.exports = {
  target: 'electron-renderer',
  devtool: 'source-map',
  entry: [
    './src',
  ],

  plugins: [
    new HtmlWebpackPlugin({ title: productName, template: 'src/index.ejs' }),
    extractCSS,
    new webpack.ExternalsPlugin('commonjs', Object.keys(dependencies)),
    new webpack.NamedModulesPlugin(),
    new webpack.LoaderOptionsPlugin({
      options: {
        postcss: [require('postcss-smart-import'), require('precss'), require('autoprefixer')],
        context: __dirname,
      },
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),
  ],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'renderer.js',
    libraryTarget: 'commonjs2',
  },
  resolve: {
    modules: [path.resolve(__dirname, './src'), 'node_modules'],
    extensions: ['.js', '.jsx', '.json', '.css'],
  },
  module: {
    loaders: [
      {
        test: /\.css/,
        loader: process.env.NODE_ENV === 'production' ? extractCSS.extract({ loader: cssLoaders }) : ['style-loader', ...cssLoaders],
      },
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        include: path.resolve('./src'),
      },
      {
        test: /\.json$/,
        loader: 'json-loader',
      },
    ],
  },
}
