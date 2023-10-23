/* eslint-disable */
export default {
  displayName: 'avidcapture-shared-ui',
  preset: '../../../../jest.preset.js',
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  transform: {
    '^.+\\.(ts|mjs|js|html)$': [
      'jest-preset-angular',
      {
        stringifyContentPathRegex: '\\.(html|svg)$',
        tsconfig: '<rootDir>/tsconfig.spec.json',
      },
    ],
  },
  transformIgnorePatterns: ['node_modules/(?!.*.mjs$|ol|pdfjs-dist)'],
  globals: {},
  coverageDirectory: '../../../../coverage/libs/avidcapture/shared/ui',
  coverageReporters: ['json', 'lcov', 'text', 'cobertura', 'html'],
  coveragePathIgnorePatterns: [
    '<rootDir>/src/assets',
    '<rootDir>/src/environments',
    '<rootDir>/src/testing',
  ],
  coverageThreshold: {
    global: {
      branches: 85,
      functions: 90,
      lines: 95,
      statements: 95,
    },
  },
  snapshotSerializers: [
    'jest-preset-angular/build/serializers/no-ng-attributes',
    'jest-preset-angular/build/serializers/ng-snapshot',
    'jest-preset-angular/build/serializers/html-comment',
  ],
};
