/* eslint-disable */
export default {
  displayName: 'shared-ui',
  preset: '../../../jest.preset.js',
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  globals: {},
  coverageDirectory: '../../../coverage/libs/shared/ui',
  coverageReporters: ['json', 'lcov', 'text', 'cobertura', 'html'],
  coveragePathIgnorePatterns: ['<rootDir>/src/lib/assets', '<rootDir>/src/testing'],
  coverageThreshold: {
    global: {
      branches: 60,
      functions: 85,
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
  transformIgnorePatterns: ['node_modules/(?!.*.mjs$)'],
};
