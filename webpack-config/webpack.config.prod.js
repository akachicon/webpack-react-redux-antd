const path = require('path');
const merge = require('webpack-merge');
const webpack = require('webpack');
const MinifyJSPlugin = require('babel-minify-webpack-plugin');
const MinifyCSSPlugin = require('optimize-css-assets-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const project = require('../project.config');
const baseConfig = require('./webpack.config.base');

module.exports = merge(baseConfig, {
  mode: 'production',
  devtool: project.sourceMaps ? 'cheap-module-source-map' : false,
  output: {
    filename: '[name].[contenthash].js',
    chunkFilename: '[name].[contenthash].js'
  },
  performance: { /* this to hide 'WARNING in asset size limit: The following asset(s) exceed the recommended size limit (244 KiB).' */
    maxEntrypointSize: 512000,
    maxAssetSize: 512000
  },
  plugins: [
    new webpack.HashedModuleIdsPlugin(),
    new CompressionPlugin({
      test: /(vendor~|shim~)/
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      reportFilename: path.resolve(project.basePath, 'bundle-report.html')
    })
  ],
  optimization: {
    minimize: true,
    minimizer: [
      new MinifyJSPlugin(
        {
          mangle: { topLevel: true },
        }
      ),
      new MinifyCSSPlugin({})
    ]
  }
});
