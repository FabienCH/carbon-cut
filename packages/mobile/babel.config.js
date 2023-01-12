module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['@babel/preset-env', 'babel-preset-expo', ['@babel/typescript', { onlyRemoveTypeImports: true }]],
    plugins: [
      ['@babel/plugin-proposal-decorators', { legacy: true }],
      '@babel/plugin-transform-flow-strip-types',
      '@babel/plugin-proposal-class-properties',
      'babel-plugin-transform-typescript-metadata',
    ],
  };
};
