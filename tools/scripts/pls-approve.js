const { execSync } = require('child_process');
const resourceGroupsWhitelist = [
  'Ax-Ae1-UicoeNp-Qa-Shared-Resources-Rg',
  'Ax-Aw1-UicoeNp-Qa-Shared-Resources-Rg',
  'Ax-Ae1-UicoeNp-Ci-Shared-Resources-Rg',
  'Ax-Aw1-UicoeNp-Ci-Shared-Resources-Rg',
  'Ax-Ae1-UicoeNp-Dv-Shared-Resources-Rg',
  'Ax-Aw1-UicoeNp-Dv-Shared-Resources-Rg',
  'Ax-Ae1-Uicoe-Pr-Shared-Resources-Rg',
  'Ax-Aw1-Uicoe-Pr-Shared-Resources-Rg',
  'Ax-Ae1-Uicoe-St-Shared-Resources-Rg',
  'Ax-Aw1-Uicoe-St-Shared-Resources-Rg',
]; // resource group whitelist

// Function to execute a CLI command and return the output as JSON
function execToJson(command) {
  const output = execSync(command);
  return JSON.parse(output);
}

try {
  // Get the subscription ID
  // const subscription = '8f9290f9-f4dc-4be5-83e2-3c831b8d66ee'; // avidpay-network-expierience nonProd
  const subscription = '3b710983-1d1a-4f27-8ebb-20161ee798ff'; // avidpay-network-expierience prod

  // Get a list of private link services
  const services = execToJson(
    `az network private-link-service list --subscription ${subscription}`
  );

  // Iterate over the private link services
  for (const service of services) {
    // Get the connections for this service
    const connections = execToJson(
      `az network private-endpoint-connection list --id ${service.id}`
    );

    // Iterate over the connection requests
    for (const connection of connections) {
      // Only proceed if the request message is not null (which indicates a pending approval)

      if (connection.properties.privateLinkServiceConnectionState.status === 'Pending') {
        // Check the connection against the whitelist
        if (resourceGroupsWhitelist.includes(connection.resourceGroup)) {
          console.log(`Approving private endpoint connection request ${connection.id}`);
          execSync(`az network private-endpoint-connection approve --id ${connection.id}`);
        } else {
          console.log(`Skipping non-whitelisted connection request ${connection.id}`);
        }
      }
    }
  }
} catch (error) {
  console.error('An error occurred:', error);
}
