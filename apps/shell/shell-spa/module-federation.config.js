module.exports = {
  name: 'shell-spa',
  remotes: [
    'tenant-spa',
    'demo-zombie-dice-spa',
    'bank-account-mgmt-spa',
    'pay-transformation-spa',
    'bus-hier-spa',
    'usr-mgmt-spa',
    'usr-roles-spa',
    'vdr-mgmt-spa',
  ],
  shared: (libraryName, defaultConfig) => {
    if (libraryName === 'luxon') {
      defaultConfig.strictVersion = false;
    }

    // Returning false means the library is not shared.
    return defaultConfig;
  },
};
