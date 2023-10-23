/* eslint-disable */
export default {
  displayName: 'avidcapture-indexing-feature',
  preset: '../../../../jest.preset.js',
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  globals: {},
  coverageDirectory: '../../../../coverage/libs/avidcapture/indexing/feature',
  coverageReporters: ['json', 'lcov', 'text', 'cobertura', 'html'],
  coveragePathIgnorePatterns: [
    '<rootDir>/src/assets',
    '<rootDir>/src/environments',
    '<rootDir>/src/testing',
  ],
  coverageThreshold: {
    global: {
      branches: 92.77,
      functions: 95,
      lines: 95,
      statements: 95,
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
  transformIgnorePatterns: ['node_modules/(?!.*.mjs$|ol|pdfjs-dist)'],
  snapshotSerializers: [
    'jest-preset-angular/build/serializers/no-ng-attributes',
    'jest-preset-angular/build/serializers/ng-snapshot',
    'jest-preset-angular/build/serializers/html-comment',
  ],
};
