module.exports = {
  name: 'pay-transformation-spa',
  exposes: {
    './Module':
      'apps/pay-transformation/pay-transformation-spa/src/app/remote-entry/entry.module.ts',
  },
  shared: (libraryName, defaultConfig) => {
    if (libraryName === 'luxon') {
      defaultConfig.strictVersion = false;
    }
  },
};
