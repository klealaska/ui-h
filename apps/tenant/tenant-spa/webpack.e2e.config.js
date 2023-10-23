const { withModuleFederation } = require('@nx/angular/module-federation');
const moduleFederationConfig = require('./module-federation.config');

module.exports = withModuleFederation({
  ...moduleFederationConfig,
}).then(fromModuleFederation => {
  return (config, context) => {
    const output = {
      ...config.output,
      scriptType: 'text/javascript',
    };
    config.output = output;
    config = fromModuleFederation(config, context);
    return config;
  };
});
