const { createGlobPatternsForDependencies } = require('@nx/angular/tailwind');

const { join } = require('path');

const sharedTailwindConfig = require('../../../tailwind.config');

module.exports = {
  presets: [sharedTailwindConfig],
  content: [
    join(__dirname, 'src/**/!(*.spec).{ts,html}'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
};
