const { execSync } = require('child_process');
const process = require('process');

// Utility function to parse arguments
function getArgValue(argPrefix, required = true) {
  const arg = process.argv.find(arg => arg.startsWith(argPrefix));
  if (!arg) {
    if (required) {
      console.error(`Please provide ${argPrefix} argument.`);
      process.exit(1);
    } else {
      return null;
    }
  }
  return arg.substring(argPrefix.length);
}

const mfeName = getArgValue('--name=');
const assignmentGroup = getArgValue('--assignmentGroup=', false);
const businessService = getArgValue('--businessService=', false);
const cmsEnabled = getArgValue('--cmsEnabled=', false);
const wikiEnabled = getArgValue('--wikiEnabled=', false);

const formattedTitle = formatTitle(mfeName);

// Define variables
const variables = {
  mfeName,
  cmsTitle: formattedTitle,
  businessService: encodeURIComponent(businessService),
  assignmentGroup: encodeURIComponent(assignmentGroup),
  capabilityPipelineName: 'capability',
  capabilityEnvPipelineName: 'capability-env',
  spaPipelineName: `${mfeName}-spa`,
  bffPipelineName: `${mfeName}-bff`,
  cmsEnabled,
  wikiEnabled,
};

// Transform variables into a string
let variablesString = Object.entries(variables)
  .map(([key, value]) => `${key}=${value}`)
  .join(' ');

try {
  let output = execSync(
    `az pipelines run --name mfe-generator --branch master --id 3611 --variables ${variablesString}`,
    { encoding: 'utf8' }
  );

  let runId = JSON.parse(output).id;
  let url = `https://dev.azure.com/avidxchange/User%20Interface%20Center%20of%20Excellence/_build/results?buildId=${runId}&view=results`;

  console.log(
    `The mfe-generator pipeline has been triggered for your new app. You can view the status here: ${url}`
  );
} catch (error) {
  console.error('An error occurred when running the pipeline:', error);
}

function formatTitle(str) {
  str = str.replace(/-([a-z])/g, function (g) {
    return '-' + g[1].toUpperCase();
  });
  return str.charAt(0).toUpperCase() + str.slice(1);
}
