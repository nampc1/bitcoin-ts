/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'node',
  // Only look for test files in the test directory that end with .test.ts
  testMatch: ['**/test/**/*.test.ts'],
  // This mapping is necessary to resolve .js extensions in imports to .ts files.
  // It's a common requirement for TypeScript projects with "type": "module".
  moduleNameMapper: {
    '^(.*)\\.js$': '$1',
  },
};