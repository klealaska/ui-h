module.exports = {
  preset: 'jest-preset-angular',
  testMatch: ['**/+(*.)+(spec).(pact).(ts)'],
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  moduleNameMapper: {
    '@ui-coe/shared/util/services': 'libs/shared/util/services/src/index.ts',
    '@ui-coe/demo/shared/util': 'libs/demo/shared/util/src/index.ts',
  },
  moduleDirectories: ['node_modules', './'],
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
    },
  },
};
