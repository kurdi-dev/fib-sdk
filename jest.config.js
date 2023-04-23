/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
  testRegex: '/test/.*\\.(test|spec)?\\.(ts|.tsx)$',
  moduleFileExtensions: ['ts', 'tsx', 'json', 'js', 'jsx', 'node'],
};
