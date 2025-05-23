const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

config.resolver.sourceExts = [...config.resolver.sourceExts, 'mjs'];

// Add Node.js polyfills
config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  events: require.resolve('events/'),
  stream: require.resolve('stream-browserify'),
  https: require.resolve('https-browserify'),
  http: require.resolve('stream-http'),
  url: require.resolve('url/'),
  crypto: require.resolve('crypto-browserify'),
  assert: require.resolve('assert/'),
  util: require.resolve('util/'),
  buffer: require.resolve('buffer/'),
  process: require.resolve('process/browser'),
};

module.exports = config; 