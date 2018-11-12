const path = require('path');
const merge = require('webpack-merge');
const webpack = require('webpack');
const project = require('../project.config');
const baseConfig = require('./webpack.config.base');

module.exports = merge(baseConfig, {
  mode: 'development',
  devtool: project.sourceMaps ? 'cheap-eval-source-map' : false,
  output: {
    filename: '[name].e.js',
    chunkFilename: '[name].c.js'
  },
  devServer: {
    port: project.dev.port,
    host: project.dev.host,
    contentBase:  path.resolve(project.basePath, project.outDir),
    clientLogLevel: project.dev.logLevel,
    hot: true
  },
  plugins: [
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ]
});
