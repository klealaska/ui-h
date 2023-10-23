/* eslint-disable */
export default {
  displayName: 'avidconnect',
  preset: '../../jest.preset.js',
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],

  transformIgnorePatterns: ['node_modules/(?!.*.mjs$)'],
  globals: {},
  coverageDirectory: '../../coverage/apps/avidconnect',
  coverageReporters: ['json', 'lcov', 'text', 'cobertura', 'html'],
  coveragePathIgnorePatterns: [
    '<rootDir>/src/assets',
    '<rootDir>/src/environments',
    '<rootDir>/src/testing',
  ],
  coverageThreshold: {
    global: {
      branches: 75,
      functions: 85, // Temporary
      lines: 90,
      statements: 90,
    },
  },
  snapshotSerializers: [
    'jest-preset-angular/build/serializers/no-ng-attributes',
    'jest-preset-angular/build/serializers/ng-snapshot',
    'jest-preset-angular/build/serializers/html-comment',
  ],
  transform: {
    '^.+\\.(ts|mjs|js|html)$': [
      'jest-preset-angular',
      {
        stringifyContentPathRegex: '\\.(html|svg)$',

        tsconfig: '<rootDir>/tsconfig.spec.json',
      },
    ],
  },
};
