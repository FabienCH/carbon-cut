const config = require('../../jest.config');

export default {
  ...config,
  preset: 'react-native',
  coverageDirectory: './coverage',
  testRegex: '.*\\.spec\\.tsx?$',
  setupFiles: ['./jest-setup.ts'],
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.spec.json',
      },
    ],
  },
  transformIgnorePatterns: ['node_modules/(?!@react-native|react-native|@rneui)'],
  moduleNameMapper: {
    '@adapters/(.*)': '<rootDir>/src/adapters/$1',
    '@domain/(.*)': '<rootDir>/src/domain/$1',
    '@infrastructure/(.*)': '<rootDir>/src/infrastructure/$1',
    '@tests/(.*)': '<rootDir>/src/tests/$1',
  },
};
