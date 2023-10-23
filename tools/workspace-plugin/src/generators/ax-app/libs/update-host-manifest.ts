import { Tree, readProjectConfiguration, updateJson } from '@nx/devkit';

// This function updates the host app's manifest, so that the new MFE can be loaded into the host.
export function updateHostManifest(tree: Tree, options: any) {
  let sourceRoot;
  if (options.host) {
    const hostAppConfig = readProjectConfiguration(tree, options.host);
    sourceRoot = hostAppConfig.sourceRoot;
    const pathToManifestJson = `${sourceRoot}/assets/manifest/module-federation.manifest.json`;
    if (!tree.exists(pathToManifestJson)) {
      return;
    }

    updateJson(tree, pathToManifestJson, manifestJson => {
      manifestJson[options.appName] = `http://localhost:${options.port}`;
      return manifestJson;
    });
  }
}
