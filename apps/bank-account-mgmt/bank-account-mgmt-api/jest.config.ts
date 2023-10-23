/* eslint-disable */
export default {
  displayName: 'bank-account-mgmt-bank-account-mgmt-api',
  preset: '../../../jest.preset.js',
  globals: {},
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
      },
    ],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../../coverage/apps/bank-account-mgmt/bank-account-mgmt-api',
};
