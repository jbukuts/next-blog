const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './'
});

const customJestConfig = {
  moduleDirectories: ['node_modules', '<rootDir>/'],
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testMatch: ['<rootDir>/**/*(*.)spec.(js|tsx)'],
  verbose: true,
  collectCoverage: true,
  collectCoverageFrom: ['**/**.js', '**/**.mjs', '**/**.tsx'],
  coverageReporters: ['text-summary', 'html', 'lcov'],
  moduleNameMapper: {
    '^.+\\.(svg)$': '<rootDir>/__mocks__/svg.js'
  },
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/.next/',
    '/bin/',
    '/deploy/',
    '/jest.config.js',
    '/jest.setup.js',
    '/next.config.mjs',
    '/build/'
  ],
  reporters: ['default'],
  testPathIgnorePatterns: ['/node_modules/', '/build/'],
  coverageThreshold: {
    global: {
      statements: 100,
      branches: 100,
      functions: 100,
      lines: 100
    }
  }
};

module.exports = createJestConfig(customJestConfig);
