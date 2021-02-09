const {join} = require('path');
const TerserJSPlugin = require('terser-webpack-plugin');

const cwd = process.cwd();

const webpackConfig = {
  mode: 'production',
  entry: './lib/index.js',
  output: {
    filename: 'i18n-core.min.js',
    path: join(cwd, 'dist'),
    library: 'I18nCore',
    libraryTarget: 'umd'
  },
  module: {
    rules:  [
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json']
  },
  optimization: {
    minimizer: [
      new TerserJSPlugin({
        sourceMap: true
      })
    ]
  },
  performance: {
    hints: false
  },
  devtool: 'source-map'
};

module.exports = webpackConfig;
