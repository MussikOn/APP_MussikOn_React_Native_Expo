module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@components': './src/components',
            "@contexts" : './src/contexts',
            '@screens': './src/screens',
            '@hooks': './src/hooks',
            '@utils': './src/utils',
            '@appTypes': './src/appTypes',
            '@styles': './src/styles',
            '@theme':'./src/theme',
            '@assets': './src/assets',
          },
        },
      ],
    ],
  };
}; 