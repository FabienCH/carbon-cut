const config = require('../../jest.config');

export default {
  ...config,
  preset: 'react-native',
  coverageDirectory: './coverage',
  testRegex: '.*\\.spec\\.tsx?$',
  setupFiles: ['./jest-setup.js'],
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.spec.json',
      },
    ],
  },
  transformIgnorePatterns: ['node_modules/(?!@react-native|react-native|@rneui)'],
};
