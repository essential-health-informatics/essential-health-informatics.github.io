module.exports = {
  preset: 'ts-jest/presets/default-esm', // Supports ES6 modules
  testEnvironment: 'jsdom',
  testMatch: ['<rootDir>/tests/**/*.(spec|test).[tj]s?(x)'],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { useESM: true }] // Ensures ES6 module support
  },
  extensionsToTreatAsEsm: ['.ts', '.tsx'] // Treat TypeScript files as ES modules
};
