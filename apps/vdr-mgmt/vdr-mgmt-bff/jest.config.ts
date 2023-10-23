/* eslint-disable */
export default {
  displayName: 'vdr-mgmt-vdr-mgmt-bff',
  preset: '../../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../../coverage/apps/vdr-mgmt/vdr-mgmt-bff',
};
