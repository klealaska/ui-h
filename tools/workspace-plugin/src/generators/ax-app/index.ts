import {
  Tree,
  GeneratorCallback,
  generateFiles,
  joinPathFragments,
  formatFiles,
  readProjectConfiguration,
  updateProjectConfiguration,
  getWorkspaceLayout,
  updateJson,
  names,
  ProjectConfiguration,
} from '@nx/devkit';
import { wrapAngularDevkitSchematic } from '@nx/devkit/ngcli-adapter';
import { Linter } from '@nx/linter';
import {
  setupMf,
  E2eTestRunner,
  UnitTestRunner,
  applicationGenerator,
} from '@nx/angular/generators';
import { getRelativePathToRootTsConfig } from '@nx/workspace/src/utilities/typescript';
import { AxIacGenerator } from '../ax-iac';
import { execSync } from 'child_process';
import { updateHostManifest } from './libs/update-host-manifest';
import { AppSchema } from '../utils/models/app-schema';
import { AppTypes } from '../utils/models/share';

export async function addAxAngularAppGenerator(
  tree: Tree,
  schema: AppSchema
): Promise<GeneratorCallback> {
  // running out of the box nrwl application schematics with preferred avidx options
  const defaultOptions: AppSchema = {
    name: `${schema.name}-spa`,
    title: schema.title,
    addTailwind: false,
    skipFormat: false,
    inlineStyle: false,
    inlineTemplate: false,
    prefix: 'ax',
    style: schema.style,
    skipPackageJson: true,
    strict: false,
    linter: Linter.EsLint,
    unitTestRunner: UnitTestRunner.Jest,
    e2eTestRunner: E2eTestRunner.Playwright,
    directory: schema.name,
    tags: `type:spa, scope:${schema.name}`,
  };
  await applicationGenerator(tree, defaultOptions);

  //delete default component
  const { appsDir } = getWorkspaceLayout(tree);

  // delete default nx app component
  tree.delete(`${appsDir}/${schema.name}/${schema.name}-spa/src/app/nx-welcome.component.ts`);

  // delete default fav icon
  tree.delete(`${appsDir}/${schema.name}/${schema.name}-spa/src/favicon.ico`);

  // updating workspace project with simply shorter name
  const deepLinkProjectName = `${schema.name}-${schema.name}-spa`;

  const shortProjectName = `${schema.name}-spa`;

  const config = readProjectConfiguration(tree, deepLinkProjectName);
  // update to new shorter name
  updateProjectConfiguration(tree, deepLinkProjectName, { ...config, name: shortProjectName });

  // update necessary config options for app
  const newConfigSpa = readProjectConfiguration(tree, shortProjectName);

  const targets = { ...newConfigSpa.targets };
  const build = `${schema.name}-spa:build`;
  //"type": "initial" budgets
  if (targets['build'] && targets['build'].configurations) {
    targets['build'].configurations.production.budgets[0].maximumWarning = '5mb';
    targets['build'].configurations.production.budgets[0].maximumError = '5mb';
    //"type": "anyComponentStyle" budgets
    targets['build'].configurations.production.budgets[1].maximumWarning = '80kb';
    targets['build'].configurations.production.budgets[1].maximumError = '200kb';
  }
  if (targets['serve'] && targets['serve'].configurations) {
    targets['serve'].configurations.production.browserTarget = `${build}:production`;
    targets['serve'].configurations.development.browserTarget = `${build}:development`;
  }
  if (targets['serve-static'] && targets['serve-static'].options) {
    targets['serve-static'].options.buildTarget = `${build}`;
  }
  if (
    targets['serve-static'] &&
    targets['serve-static'].configurations &&
    targets['serve-static'].configurations.production &&
    targets['serve-static'].configurations.development
  ) {
    targets['serve-static'].configurations.production.buildTarget = `${build}:production`;
    targets['serve-static'].configurations.development.buildTarget = `${build}:development`;
  }

  targets['extract-i18n'].options.browserTarget = build;
  targets['build'].options.styles = [
    ...targets['build'].options.styles,
    'libs/shared/dsm-styles-v2/src/lib/scss/styles.scss',
  ];

  if (schema.includeBff) {
    const angularAppSchematic = wrapAngularDevkitSchematic('@nx/nest', 'application');
    const defaultOptions = {
      name: `${schema.name}-bff`,
      directory: `${schema.name}`,
      tags: `type:bff, scope:${schema.name}`,
    };
    await angularAppSchematic(tree, { ...defaultOptions });

    const deepLinkBFFName = `${schema.name}-${schema.name}-bff`;
    const shortBFFName = `${schema.name}-bff`;

    const config = readProjectConfiguration(tree, deepLinkBFFName);
    const newConfig = {
      ...config,
      targets: {
        ...config.targets,
        build: {
          ...config.targets?.build,
          options: { ...config.targets?.build?.options, generatePackageJson: true },
        },
      },
    } as ProjectConfiguration;
    // update new shorter name
    updateProjectConfiguration(tree, deepLinkBFFName, { ...newConfig, name: shortBFFName });

    if (schema.includeMockServer) {
      // mock server config for spa
      if (targets['build'] && targets['build'].configurations)
        targets['build'].configurations.mock = {
          fileReplacements: [
            {
              replace: `apps/${schema.name}/${shortProjectName}/src/environments/environment.ts`,
              with: `apps/${schema.name}/${shortProjectName}/src/environments/environment.mock.ts`,
            },
          ],
        };
      if (targets['serve'] && targets['serve'].configurations)
        targets['serve'].configurations.mock = {
          browserTarget: `${shortProjectName}:build:mock`,
        };

      // update necessary config options for bff begin
      const newConfigBFF = readProjectConfiguration(tree, shortBFFName);

      const targetsBff = { ...newConfigBFF.targets };
      if (targetsBff['build'] && targetsBff['build'].configurations) {
        targetsBff['build'].configurations.mock = {
          fileReplacements: [
            {
              replace: `apps/${schema.name}/${shortBFFName}/src/environments/environment.ts`,
              with: `apps/${schema.name}/${shortBFFName}/src/environments/environment.mock.ts`,
            },
          ],
        };
      }

      targetsBff['serve'].options.buildTarget = `${shortBFFName}:build`;
      targetsBff['serve'].configurations = {
        production: {
          buildTarget: `${shortBFFName}:build:production`,
        },
        mock: {
          buildTarget: `${shortBFFName}:build:mock`,
        },
      };

      updateProjectConfiguration(tree, shortBFFName, {
        ...newConfigBFF,
        targets: targetsBff,
      });
      // update necessary config options for bff begin end

      const nameKeyValues = names(schema.name);
      //bff mock server files
      generateFiles(
        tree,
        joinPathFragments(__dirname, './files/bff'),
        `apps/${schema.name}/${schema.name}-bff`,
        {
          tmpl: '',
          ...nameKeyValues,
        }
      );

      // add mock env file to spa
      generateFiles(
        tree,
        joinPathFragments(__dirname, './files/environments'),
        `apps/${schema.name}/${schema.name}-spa/src/environments`,
        {
          tmpl: '',
        }
      );
    } else {
      if (targets['serve'] && targets['serve'].configurations) {
        targets['serve'].configurations.development = {};
      }
    }
  }

  updateProjectConfiguration(tree, shortProjectName, {
    ...newConfigSpa,
    targets,
  });

  const nameKeyValues = names(schema.name);

  tree.delete(
    `${appsDir}/${schema.name}/${schema.name}-spa/src/app/remote-entry/entry.component.ts`
  );

  let options;
  switch (schema.type) {
    case AppTypes.REMOTE:
      options = {
        mfType: AppTypes.REMOTE,
        host: schema.host ? schema.host : '',
        port: schema.remotePortNumber,
        appName: shortProjectName,
      };
      await setupMf(tree, options);
      break;
  }

  //file overrides that include tailwind config, translation and assests
  const newConfigApp = readProjectConfiguration(tree, shortProjectName);
  const rootTsConfigPathApp = getRelativePathToRootTsConfig(tree, newConfigApp.root);

  generateFiles(
    tree,
    joinPathFragments(__dirname, schema.type === AppTypes.HOST ? './files/host' : './files/remote'),
    `apps/${schema.name}/${shortProjectName}`,
    {
      ...nameKeyValues,
      title: schema.title ? names(schema.title).name : nameKeyValues.className,
      rootTsConfigPathApp,
      domainName: schema.name,
      entryModule: `src/app/remote-entry/entry.module.ts`,
      tmpl: '',
      portNumber: schema.remotePortNumber,
      appName: shortProjectName,
    }
  );

  // e2e overrides
  generateFiles(
    tree,
    joinPathFragments(__dirname, './files/e2e'),
    `apps/${schema.name}/${schema.name}-spa-e2e`,
    {
      tmpl: '',
      appName: `${schema.name}-spa`,
      e2eAppName: `${schema.name}-spa-e2e`,
      domain: schema.name,
      portNumber: schema.remotePortNumber,
    }
  );

  // Update manifest of host app
  updateHostManifest(tree, options);

  // add handy scripts
  updateJson(tree, 'package.json', pkgJson => {
    // if scripts is undefined, set it to an empty object
    pkgJson.scripts = pkgJson.scripts ?? {};

    // add start app script
    pkgJson.scripts[`start:${schema.name}-spa`] = `nx serve ${schema.name}-spa -c development`;
    pkgJson.scripts[
      `start:${schema.name}-spa:shell`
    ] = `nx serve shell-spa --devRemotes=${schema.name}-spa -c development`;
    if (schema.includeMockServer) {
      pkgJson.scripts[`start:${schema.name}-spa:mock`] = `nx serve ${schema.name}-spa -c mock`;
    }
    if (schema.includeBff) {
      pkgJson.scripts[`start:${schema.name}-bff`] = `nx serve ${schema.name}-bff -c development`;
      if (schema.includeMockServer) {
        pkgJson.scripts[`start:${schema.name}-bff:mock`] = `nx serve ${schema.name}-bff -c mock`;
      }
    }
    // add e2e script
    pkgJson.scripts[`e2e:${schema.name}-e2e`] = `npx playwright test ${schema.name}-e2e --ui`;
    // return modified JSON object
    return pkgJson;
  });
  if (schema.includeIaC && schema.notificationsEmail) {
    // generate IaC files
    await AxIacGenerator(tree, {
      domain: schema.name,
      email: schema.notificationsEmail,
      includeBff: schema.includeBff,
    });
  }

  // The nrwl/nest generator is now creating a bff-e2e. We want to delete that project for now.
  tree.delete(`${appsDir}/${schema.name}/${schema.name}-${schema.name}-bff-e2e`);

  // format all files
  await formatFiles(tree);

  const isDryRun = process.env.NX_DRY_RUN === 'true';
  if (!isDryRun) {
    try {
      execSync(
        `npm run generate:mfe-pipelines -- --name=${schema.name} --cmsEnabled=${schema.cmsEnabled} --wikiEnabled=${schema.wikiEnabled} --businessService=${schema.businessService} --assignmentGroup=${schema.assignmentGroup}`,
        { stdio: 'inherit' }
      );
    } catch (error) {
      console.error('Error running Node script for generating pipelines: ', error);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  return () => {};
}

export default addAxAngularAppGenerator;
