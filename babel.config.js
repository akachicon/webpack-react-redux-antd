module.exports = (api) => {
  const __DEV__ = api.env('development');
  const __PROD__ = api.env('production');

  api.cache.forever();

  const config = {
    plugins: [
      [
        'babel-plugin-import',
        {
          libraryName: 'antd',
          libraryDirectory: 'es',
          style: 'css'
        }
      ],
      '@babel/plugin-syntax-dynamic-import',
      [
        '@babel/plugin-transform-runtime',
        {
          regenerator: false,
          useESModules: true
        }
      ]
    ],
    presets: [
      [
        '@babel/preset-env',
        {
          modules: false,
          useBuiltIns: 'usage',
          debug:  __DEV__,
          // forceAllTransforms: __PROD__  // in case of using UglifyJS
        }
      ],
      [
        '@babel/preset-react',
        {
          development: __DEV__
        }
      ]
    ]
  };

  if (__DEV__) {
    config.plugins.unshift('react-hot-loader/babel');
  }

  return config;
};
