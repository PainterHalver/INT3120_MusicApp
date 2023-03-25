module.exports = function (api) {
  const isProduction = api.env('production');

  const presets = [
    'module:metro-react-native-babel-preset'
  ];

  const plugins = [
    // your plugins here
    // ['module-resolver',
    //   {
    //     alias: {
    //       'crypto': 'react-native-quick-crypto',
    //       'stream': 'stream-browserify',
    //       'buffer': '@craftzdog/react-native-buffer',
    //     }
    //   }],
    'react-native-reanimated/plugin',
    // [
    //   'react-native-reanimated/plugin', {
    //     relativeSourceLocation: true,
    //   },
    // ]
  ];

  if (isProduction) {
    plugins.push('transform-remove-console');
  }

  return {
    presets,
    plugins,
  };
};
