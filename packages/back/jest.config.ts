// eslint-disable-next-line @typescript-eslint/no-var-requires
const config = require('../../jest.config');

export default {
  ...config,
  rootDir: 'src',
  coverageDirectory: '../coverage',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  moduleNameMapper: {
    '@adapters/(.*)': '<rootDir>/adapters/$1',
    '@domain/(.*)': '<rootDir>/domain/$1',
    '@infrastructure/(.*)': '<rootDir>/infrastructure/$1',
    '@tests/(.*)': '<rootDir>/tests/$1',
  },
  testEnvironment: 'node',
};
