module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo', ['@babel/typescript', { onlyRemoveTypeImports: true }]],
    plugins: [
      ['@babel/plugin-proposal-decorators', { legacy: true }],
      '@babel/plugin-transform-flow-strip-types',
      ['@babel/plugin-proposal-class-properties', { loose: true }],
      ['@babel/plugin-proposal-private-methods', { loose: true }],
      'babel-plugin-transform-typescript-metadata',
      [
        'module-resolver',
        {
          alias: {
            '@adapters': './src/adapters',
            '@domain': './src/domain',
            '@infrastructure': './src/infrastructure',
          },
        },
      ],
    ],
  };
};
