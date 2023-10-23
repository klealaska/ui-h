const { getJestProjects } = require('@nx/jest');

export default {
  reporters: ['default', 'jest-junit'],
  projects: getJestProjects(),
};
