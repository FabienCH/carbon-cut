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
  testEnvironment: 'node',
};
