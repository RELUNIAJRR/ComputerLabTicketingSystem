module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      '@babel/plugin-transform-export-namespace-from',
      'react-native-reanimated/plugin',
      require.resolve('expo-router/babel'),
      ['module-resolver', {
        alias: {
          stream: 'stream-browserify',
          crypto: 'crypto-browserify'
        },
      }],
    ],
  };
}; 