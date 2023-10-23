/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable no-case-declarations */
import {
  Tree,
  formatFiles,
  readProjectConfiguration,
  generateFiles,
  joinPathFragments,
  names,
} from '@nx/devkit';
import { wrapAngularDevkitSchematic } from '@nx/devkit/ngcli-adapter';
import { StylesTypes } from '../utils/models/share';
import { LibSchema, LibTypes } from '../utils/models/lib-schema';
import { libraryGenerator } from '@nx/angular/generators';

export default async function addAxLibGenerator(tree: Tree, schema: LibSchema) {
  let name = '';
  let srcRoot;
  let libRoot;
  const namesKeyValue = names(schema.directory ? schema.directory : schema.name);
  const substitutions = {
    tmpl: '',
    ...namesKeyValue,
  };
  let dirObj;
  const defaultOptions = {
    strict: false,
    buildable: true,
  };

  switch (schema.type) {
    case LibTypes.FEATURE:
      dirObj = normalizeDirNameOptions(schema);
      name = `feature`;

      await libraryGenerator(tree, {
        ...defaultOptions,
        name,
        directory: dirObj ? `${dirObj.directory}` : '',
        tags: dirObj
          ? `type:${LibTypes.FEATURE}, scope:${dirObj.scope}`
          : `type:${LibTypes.FEATURE}`,
      });

      const libName = `${dirObj.libDirPrefix}-${name}`;
      srcRoot = readProjectConfiguration(tree, libName).sourceRoot;
      // remove the `/src` from the end of srcRoot path so we can place files outside of src
      libRoot = srcRoot.split('/').slice(0, -1).join('/');

      // delete default module file so we can use our own
      tree.delete(`${srcRoot}/lib/${libName}.ts`);
      tree.delete(`${srcRoot}/lib/${libName}.spec.ts`);

      generateFiles(tree, joinPathFragments(__dirname, './files/feature'), libRoot, {
        ...substitutions,
        scope: dirObj.libDirPrefix.includes('/') ? dirObj.scope : '',
        fullFileName: libName,
        libDirPrefix: dirObj.libDirPrefix,
      });

      // create angular component
      // eslint-disable-next-line no-case-declarations
      const angularComponentSchematic = wrapAngularDevkitSchematic(
        '@schematics/angular',
        'component'
      );
      // eslint-disable-next-line no-case-declarations
      const componentName = `${libName}-container`;

      // run angular component schematic
      await angularComponentSchematic(tree, {
        name: `containers/${componentName}/${componentName}`,
        inlineTemplate: false,
        prefix: 'ui-coe',
        skipTests: false,
        style: StylesTypes.SCSS,
        flat: true,
        skipImport: false,
        project: libName,
      });
      const componentfilePath = `${srcRoot}/lib/containers/${componentName}/${componentName}.component.html`;
      const componentContent = tree.read(componentfilePath, 'utf8');
      const contentReplace = componentContent?.replace(
        `<p>${componentName} works!</p>`,
        `<router-outlet></router-outlet>`
      );

      if (contentReplace) {
        tree.write(componentfilePath, contentReplace);
      }
      break;

    case LibTypes.DATA:
      dirObj = normalizeDirNameOptions(schema);
      name = 'data-access';

      await libraryGenerator(tree, {
        ...defaultOptions,
        name,
        directory: dirObj ? `${dirObj.directory}` : '',
        tags: dirObj ? `type:${LibTypes.DATA}, scope:${dirObj.scope}` : `type:${LibTypes.DATA}`,
      });

      const libNameData = `${dirObj.libDirPrefix}-${name}`;
      srcRoot = readProjectConfiguration(tree, libNameData).sourceRoot;

      tree.delete(`${srcRoot}/lib/${libNameData}.ts`);
      tree.delete(`${srcRoot}/lib/${libNameData}.spec.ts`);
      srcRoot = readProjectConfiguration(tree, libNameData).sourceRoot;
      // remove the `/src` from the end of srcRoot path so we can place files outside of src
      libRoot = srcRoot.split('/').slice(0, -1).join('/');

      generateFiles(tree, joinPathFragments(__dirname, './files/data'), libRoot, {
        ...substitutions,
        scope: dirObj.libDirPrefix.includes('/') ? dirObj.scope : '',
        fullFileName: libNameData,
        libDirPrefix: dirObj.libDirPrefix,
      });

      break;

    case LibTypes.UTIL:
      dirObj = normalizeDirNameOptions(schema);
      name = `util`;

      await libraryGenerator(tree, {
        ...defaultOptions,
        name,
        directory: dirObj ? `${dirObj.directory}` : '',
        tags: dirObj ? `type:${LibTypes.UTIL}, scope:${dirObj.scope}` : `type:${LibTypes.UTIL}`,
      });

      const libNameUtil = `${dirObj.libDirPrefix}-${name}`;
      srcRoot = readProjectConfiguration(tree, libNameUtil).sourceRoot;

      tree.delete(`${srcRoot}/lib/${libNameUtil}.ts`);
      tree.delete(`${srcRoot}/lib/${libNameUtil}.spec.ts`);
      generateFiles(tree, joinPathFragments(__dirname, './files/util'), `${srcRoot}`, {
        ...substitutions,
        scope: dirObj.libDirPrefix.includes('/') ? dirObj.scope : '',
        fullFileName: libNameUtil,
      });

      break;

    case LibTypes.UI:
      dirObj = normalizeDirNameOptions(schema);
      name = `ui`;

      await libraryGenerator(tree, {
        ...defaultOptions,
        name,
        directory: dirObj ? `${dirObj.directory}` : '',
        tags: dirObj ? `type:${LibTypes.UI}, scope:${dirObj.scope}` : `type:${LibTypes.UI}`,
      });

      const libNameUi = `${dirObj.libDirPrefix}-${name}`;
      srcRoot = readProjectConfiguration(tree, libNameUi).sourceRoot;
      // remove the `/src` from the end of srcRoot path so we can place files outside of src
      libRoot = srcRoot.split('/').slice(0, -1).join('/');

      tree.delete(`${srcRoot}/lib/${libNameUi}.ts`);
      tree.delete(`${srcRoot}/lib/${libNameUi}.spec.ts`);
      generateFiles(tree, joinPathFragments(__dirname, './files/ui'), libRoot, {
        ...substitutions,
        scope: dirObj.libDirPrefix.includes('/') ? dirObj.scope : '',
        fullFileName: libNameUi,
        libDirPrefix: dirObj.libDirPrefix,
      });

      break;

    case LibTypes.TYPES:
      dirObj = normalizeDirNameOptions(schema);
      name = `types`;
      await libraryGenerator(tree, {
        ...defaultOptions,
        name,
        directory: dirObj ? `${dirObj.directory}` : '',
        tags: dirObj ? `type:${LibTypes.TYPES}, scope:${dirObj.scope}` : `type:${LibTypes.TYPES}`,
      });
      const libNameTypes = `${dirObj.libDirPrefix}-${name}`;
      srcRoot = readProjectConfiguration(tree, libNameTypes).sourceRoot;
      tree.delete(`${srcRoot}/lib/${libNameTypes}.ts`);
      tree.delete(`${srcRoot}/lib/${libNameTypes}.spec.ts`);
      generateFiles(tree, joinPathFragments(__dirname, './files/types'), `${srcRoot}`, {
        ...substitutions,
        scope: dirObj.libDirPrefix.includes('/') ? dirObj.scope : '',
        fullFileName: libNameTypes,
      });
      break;
  }

  await formatFiles(tree);
  return () => {};
}

function normalizeDirNameOptions(schema) {
  let directoryArray;
  let libDirPrefix;
  if (schema.directory) {
    if (schema.directory.includes('libs')) {
      schema.directory = schema.directory.replace('libs/', '');
    }
    directoryArray = schema.directory.split('/');
    libDirPrefix = directoryArray.join('-');
    return {
      directoryArray,
      libDirPrefix,
      scope: directoryArray[directoryArray.length - 1].toLowerCase(),
      directory: schema.directory,
    };
  }
  return null;
}
