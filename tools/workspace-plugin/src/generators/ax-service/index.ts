// TODO 2 options 1 use angular schematic to scaffold service and then use AST utils to modify spec
// 2 keep this and modify the files being created to use conditionals in the template files
import {
  Tree,
  formatFiles,
  readProjectConfiguration,
  generateFiles,
  joinPathFragments,
  names,
} from '@nx/devkit';
import * as pluralize from 'pluralize';

export async function generateService(tree: Tree, schema: any): Promise<void> {
  const sourceRoot = readProjectConfiguration(tree, schema.projectName).sourceRoot;
  const nameKeyValues = names(schema.name);
  const configKeyValues = names(schema.configKey);
  const substitutions = {
    tmpl: '',
    fileName: nameKeyValues.name,
    name: {
      ...nameKeyValues,
      namePlural: pluralize(nameKeyValues.name),
      classNamePlural: pluralize(nameKeyValues.className),
    },
    swaggerUrl: schema.swaggerUrl,
    configKey: {
      ...configKeyValues,
    },
  };

  generateFiles(tree, joinPathFragments(__dirname, './files'), `${sourceRoot}/lib/services`, {
    ...substitutions,
  });

  await formatFiles(tree);
}
export default generateService;
