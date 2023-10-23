const coreLibraries = new Set(['luxon']);

module.exports = {
  name: 'demo-zombie-dice-spa',
  exposes: {
    './Module': 'apps/demo/zombie-dice-spa/src/app/remote-entry/entry.module.ts',
  },
  shared: (libraryName, defaultConfig) => {
    if (libraryName === 'luxon') {
      defaultConfig.strictVersion = false;
    }
    if (libraryName === '@ui-coe/shared/util/services') {
      defaultConfig.singleton = true;
    }
    if (coreLibraries.has(libraryName)) {
      return defaultConfig;
    }
    // Returning false means the library is not shared.
    return defaultConfig;
  },
};
