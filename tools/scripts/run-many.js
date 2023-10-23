const execSync = require('child_process').execSync;

const commands = JSON.parse(process.argv[2]);
const projects = commands[process.argv[3]];
const target = process.argv[4];
if (target === 'test') {
  execSync(
    `npx nx run-many --target=test --projects=${projects.join(
      ','
    )} --codeCoverage=true --reporters=default --reporters=jest-junit --maxWorkers=1`,
    {
      stdio: [0, 1, 2],
    }
  );
} else if (target === 'build') {
  execSync(`npx nx run-many --target=build --projects=${projects.join(',')}  --with-deps --prod`, {
    stdio: [0, 1, 2],
  });
} else {
  execSync(`npx nx run-many --target=${target} --projects=${projects.join(',')} --with-deps`, {
    stdio: [0, 1, 2],
  });
}
