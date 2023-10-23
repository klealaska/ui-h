module.exports = {
  name: 'tenant-spa',
  exposes: {
    './Module': 'apps/tenant/tenant-spa/src/app/remote-entry/entry.module.ts',
  },
  shared: (libraryName, defaultConfig) => {
    if (libraryName === 'luxon') {
      defaultConfig.strictVersion = false;
    }
    // Returning false means the library is not shared.
    return defaultConfig;
  },
};
