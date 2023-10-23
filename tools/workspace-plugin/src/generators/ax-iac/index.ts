import {
  Tree,
  formatFiles,
  installPackagesTask,
  generateFiles,
  joinPathFragments,
} from '@nx/devkit';

export async function AxIacGenerator(tree: Tree, schema: any) {
  generateFiles(tree, joinPathFragments(__dirname, './files/iac'), `apps/${schema.domain}/iac`, {
    tmpl: '',
    domain: schema.domain,
    email: schema.email,
    includeBff: schema.includeBff,
  });

  generateFiles(
    tree,
    joinPathFragments(__dirname, './files/pipelines'),
    `apps/${schema.domain}/pipelines`,
    {
      tmpl: '',
      domain: schema.domain,
      email: schema.email,
      includeBff: schema.includeBff,
    }
  );

  // If 'includeBff' is false, we want to remove BFF specific files
  if (!schema.includeBff) {
    const bffOnly = [
      'iac/variables/apim',
      `pipelines/${schema.domain}-bff-apim.yml`,
      `pipelines/${schema.domain}-bff.yml`,
      'pipelines/variables/bff.yml',
    ];
    const basePath = `apps/${schema.domain}`;

    // Delete the files you don't want
    bffOnly.forEach(path => {
      tree.delete(`${basePath}/${path}`);
    });
  }

  await formatFiles(tree);
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  return () => {};
}

export default AxIacGenerator;
