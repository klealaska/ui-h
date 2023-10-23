import { defineConfig } from 'cypress';
import * as webpack from '@cypress/webpack-preprocessor';
import { addCucumberPreprocessorPlugin } from '@badeball/cypress-cucumber-preprocessor';
import { nxE2EPreset } from '@nx/cypress/plugins/cypress-preset';

async function setupNodeEvents(
  on: Cypress.PluginEvents,
  config: Cypress.PluginConfigOptions
): Promise<Cypress.PluginConfigOptions> {
  // This is required for the preprocessor to be able to generate JSON reports after each run, and more,
  await addCucumberPreprocessorPlugin(on, config);

  on(
    'file:preprocessor',
    webpack({
      webpackOptions: {
        resolve: {
          extensions: ['.ts', '.js'],
        },
        module: {
          rules: [
            {
              test: /\.ts$/,
              exclude: [/node_modules/],
              use: [
                {
                  loader: 'ts-loader',
                },
              ],
            },
            {
              test: /\.feature$/,
              use: [
                {
                  loader: '@badeball/cypress-cucumber-preprocessor/webpack',
                  options: config,
                },
              ],
            },
          ],
        },
      },
    })
  );

  // Make sure to return the config object as it might have been modified by the plugin.
  return config;
}

module.exports = defineConfig({
  fileServerFolder: '.',
  fixturesFolder: './src/fixtures',
  modifyObstructiveCode: false,
  video: true,
  videosFolder: '../../../dist/cypress/apps/demo/zombie-dice-spa-e2e/videos',
  screenshotsFolder: '../../../dist/cypress/apps/demo/zombie-dice-spa-e2e/screenshots',
  chromeWebSecurity: false,
  viewportWidth: 1400,
  viewportHeight: 700,
  env: {
    tsConfig: 'tsconfig.json',
  },
  e2e: {
    ...nxE2EPreset(__dirname),
    specPattern: './src/integration/**/*.feature',
    supportFile: './src/support/index.ts',
    baseUrl: 'http://localhost:4200',
    setupNodeEvents,
  },
});