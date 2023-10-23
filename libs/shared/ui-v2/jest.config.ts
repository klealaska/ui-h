/* eslint-disable */
export default {
  displayName: 'shared-ui-v2',
  preset: '../../../jest.preset.js',
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  globals: {},
  coverageDirectory: '../../../coverage/libs/shared/ui-v2',
  coverageReporters: ['json', 'lcov', 'text', 'cobertura', 'html'],
  testPathIgnorePatterns: ['<rootDir>/*/playwright/'],
  coveragePathIgnorePatterns: [
    '<rootDir>/src/lib/assets',
    '<rootDir>/src/testing',
    '<rootDir>/src/lib/tooltip/tooltip.directive.ts',
    '<rootDir>/src/lib/dropzone/dropzone.directive.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  transform: {
    '^.+\\.(ts|mjs|js|html)$': [
      'jest-preset-angular',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
        stringifyContentPathRegex: '\\.(html|svg)$',
      },
    ],
  },
  transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$)'],
  snapshotSerializers: [
    'jest-preset-angular/build/serializers/no-ng-attributes',
    'jest-preset-angular/build/serializers/ng-snapshot',
    'jest-preset-angular/build/serializers/html-comment',
  ],
};
