const execSync = require('child_process').execSync;
const isMaster = process.argv[2] === 'False';
const baseSha = isMaster ? 'origin/master~1' : 'origin/master';
const allApps = process.argv[3] === 'true'; // Check if the third argument is True for all apps

let apps;

// If 'allApps' is true, we get the list off all apps and return them
if (allApps) {
  const allProjects = execSync(`npx nx show projects --with-target serve`).toString().trim();
  apps = allProjects.split(',');
} else {
  apps = execSync(
    `npx nx show projects --affected --base=origin/master~1 --with-target serve --plain`
  )
    .toString()
    .trim()
    .split(',');
}

console.log(apps.join(' '));
