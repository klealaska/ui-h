module.exports = {
  name: 'bus-hier-spa',
  exposes: {
    './Module': 'apps/bus-hier/bus-hier-spa/src/app/remote-entry/entry.module.ts',
  },
  shared: (libraryName, defaultConfig) => {
    if (libraryName === 'luxon') {
      defaultConfig.strictVersion = false;
    }
    // Returning false means the library is not shared.
    return defaultConfig;
  },
};
