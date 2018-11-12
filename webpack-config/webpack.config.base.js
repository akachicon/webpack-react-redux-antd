const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebappWebpackPlugin = require('webapp-webpack-plugin');
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const project = require('../project.config');

const inProject = path.resolve.bind(path, project.basePath);
const inProjectSrc = (...files) => inProject(project.srcDir, ...files);

const __DEV__ = project.env === 'development';

module.exports = {
  context: inProjectSrc(''),
  entry: {
    main: [
      inProjectSrc(project.bootstrap),
      inProjectSrc(project.main)
    ]
  },
  output: {
    path: inProject(project.outDir),
    publicPath: project.publicPath
  },
  externals: project.externals,
  resolve: {
    modules: [
      inProject(project.srcDir),
      'node_modules'
    ],
    alias: {
      '@ant-design/icons' : 'purched-antd-icons'    // https://github.com/ant-design/ant-design/issues/12011#issuecomment-423796712
    },
    extensions: ['*', '.js', '.jsx', '.json', '.css' ]
  },
  module: {
    rules: [
      {
        // it's assumed that the dependencies of antd/@ant-design have no need to be polyfilled
        // otherwise, you must specify them in the exclude regexp so that babel could handle polyfills
        test: /\.(m?js|jsx)$/,
        exclude: (modulePath) => {
          return /node_modules/.test(modulePath) &&
          !/node_modules[\\/]@babel[\\/]runtime/.test(modulePath) &&
          !/node_modules[\\/]antd/.test(modulePath) &&
          !/node_modules[\\/]@ant-design/.test(modulePath);
        },
        use: [
          {
            loader: 'babel-loader',
            options: {
              // cacheDirectory: __DEV__,
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: __DEV__ ? 'style-loader' : MiniCssExtractPlugin.loader,
        oneOf: [
          {
            test: /[\\/]antd[\\/]/,
            use: [
              {
                loader: 'css-loader',
                options: {
                  modules: false
                }
              },
            ]
          },
          {
            use: [
              {
                loader: 'css-loader',
                options: {
                  importLoaders: 1,
                  modules: true
                }
              },
              {
                loader: 'postcss-loader',
                options: {
                  ident: 'postcss',
                  plugins: [
                    require('autoprefixer')({})
                  ]
                }
              }
            ]
          }
        ]
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg|woff|woff2)$/,
        loader: 'url-loader',
        options: {
          limit: 8192
        }
      }
    ]
  },
  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      // http/1 config
      minSize: 0,
      maxSize: Infinity,
      name: true,
      chunks: 'all',
      cacheGroups: {
        default: false,
        vendors: false,
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          minChunks: 1,
          enforce: true,
          priority: 5
        },
        shim: {
          test: /[\\/](core-js|regenerator-runtime|@babel)[\\/]/,
          minChunks: 1,
          enforce: true,
          priority: 10
        },
        style: {
          name: 'style',
          test: /\.css$/,
          minChunks: 1,
          enforce: true,
          priority: 15
        },
        common: {
          minChunks: 2,
          enforce: true,
          reuseExistingChunk: true
        }
      }
    },
  },
  plugins: [
    new CleanWebpackPlugin(['dist'], { root: project.basePath }),
    new webpack.NamedChunksPlugin(),
    new HtmlWebpackPlugin({
      inlineSource: 'runtime',
      template: inProjectSrc(project.html.template),
      appMountId: 'root',
      minify: __DEV__ ? false : {
        collapseWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        useShortDoctype: true
      }
    }),
    new WebappWebpackPlugin({
      logo: 'app-logo.png',
      prefix: 'favicons/',
      favicons: {
        appName: project.html.title,
        developerName: null,
        developerURL: null, // prevent retrieving from the nearest package.json
        background: '#ddd',
        theme_color: '#333',
        icons: {
          yandex: false
        }
      }
    }),
    new HtmlWebpackInlineSourcePlugin(),
    new MiniCssExtractPlugin({
      filename: __DEV__ ? '[name].css' : '[name].[contenthash].css',
      chunkFilename: __DEV__ ? '[id].css' : '[id].[contenthash].css',
    })
  ]
};
