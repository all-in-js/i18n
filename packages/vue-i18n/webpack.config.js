const path = require('path');
const TerserJSPlugin = require('terser-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

const cwd = process.cwd();

module.exports = {
  mode: 'production',
  entry: './lib/index.js',
  output: {
    path: path.join(cwd, './dist/'),
    filename: 'vue-i18n.min.js',
    library: 'VueI18n',
    libraryTarget: 'umd'
  },
  externals: {
    vue: {
      root: 'Vue',
      commonjs2: 'vue',
      commonjs: 'vue',
      amd: 'vue',
    }
  },
  resolve: {
    modules: ['node_modules', path.join(__dirname, '../node_modules')],
    extensions: ['.js', '.jsx', '.vue', '.md', '.json'],
    alias: {
      vue$: 'vue/dist/vue.esm.js'
    },
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          compilerOptions: {
            preserveWhitespace: false
          }
        }
      },
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader'
      }
    ],
  },
  plugins: [
    new VueLoaderPlugin()
  ],
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
