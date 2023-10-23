module.exports = {
  preset: 'jest-preset-angular',
  testMatch: ['**/+(*.)+(spec).(pact).(ts)'],
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  moduleNameMapper: {
    '@ui-coe/shared/ui': 'libs/shared/ui/src/index.ts',
    '@ui-coe/shared/util/auth': 'libs/shared/util/auth/src/index.ts',
    '@ui-coe/shared/util/interfaces': 'libs/shared/util/interfaces/src/index.ts',
    '@ui-coe/avidcapture/shared/types': 'libs/avidcapture/shared/types/src/index.ts',
    '@ui-coe/avidcapture/shared/test': 'libs/avidcapture/shared/test/src/index.ts',
  },
  moduleDirectories: ['node_modules', './'],
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
    },
  },
};
