module.exports = {
  name: 'usr-mgmt-spa',
  exposes: {
    './Module': 'apps/usr-mgmt/usr-mgmt-spa/src/app/remote-entry/entry.module.ts',
  },
  shared: (libraryName, defaultConfig) => {
    if (libraryName === 'luxon') {
      defaultConfig.strictVersion = false;
    }
    // Returning false means the library is not shared.
    return defaultConfig;
  },
};
