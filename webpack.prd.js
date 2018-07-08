const path = require('path');
const glob = require('glob');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'production',
  target: 'node',
  externals: {
    realm: 'realm',
  },
  entry: glob.sync('./src/**/index.ts').reduce((acc, next) => ({ ...acc, [next.match(/src\/(.*\/)/)[1]]: next }), {}),
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[name]/index.js',
    libraryTarget: 'commonjs',
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        include: [path.resolve(__dirname, 'src')],
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env', '@babel/preset-typescript'],
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.ts', '.json'],
    modules: ['node_modules', 'src'],
  },
  plugins: [
    new CopyWebpackPlugin([{ context: 'src', from: '**/function.json', to: '' }, 'host.json', 'package.json']),
    new webpack.DefinePlugin({ 'global.GENTLY': false }),
  ],
  node: {
    __dirname: false,
    __filename: false,
  },
};
