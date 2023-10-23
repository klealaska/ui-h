const { execSync } = require('child_process');
const process = require('process');

function getArgValue(argPrefix, required = true) {
  const arg = process.argv.find(arg => arg.startsWith(argPrefix));
  if (!arg && required) {
    console.error(`Please provide ${argPrefix} argument.`);
    process.exit(1);
  }
  return arg ? arg.substring(argPrefix.length) : null;
}

const [resourceGroup, fdName, securityPolicyName] = [
  '--resourceGroup=',
  '--fdName=',
  '--securityPolicyName=',
].map(getArgValue);

const endpointIds = getEndpointIds();
console.log(`Adding the following endpoints to the ${fdName} security policy: `, endpointIds);
updateSecurityPolicy(endpointIds);

function getEndpointIds() {
  try {
    const output = execSync(
      `az afd endpoint list --resource-group ${resourceGroup} --profile-name ${fdName}`,
      { encoding: 'utf8' }
    );
    const endpoints = JSON.parse(output);
    return endpoints.map(endpoint => endpoint.id);
  } catch (error) {
    console.error('An error occurred when fetching endpoint IDs:', error);
    process.exit(1);
  }
}

function updateSecurityPolicy(endpointIds) {
  const formattedEndpoints = endpointIds.join(' ');
  try {
    execSync(
      `az afd security-policy update --resource-group ${resourceGroup} --profile-name ${fdName} --security-policy-name ${securityPolicyName} --domains ${formattedEndpoints}`,
      { encoding: 'utf8' }
    );
  } catch (error) {
    console.error('An error occurred when updating security policy:', error);
    process.exit(1);
  }
}
