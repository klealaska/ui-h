/* eslint-disable */
export default {
  displayName: 'demo-zombie-dice-api',
  preset: '../../../jest.preset.js',
  globals: {},
  transform: {
    '^.+\\.[tj]s$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
      },
    ],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../../coverage/apps/demo/zombie-dice-api',
  testPathIgnorePatterns: ['<rootDir>/'],
  testEnvironment: 'node',
};
