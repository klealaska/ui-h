import type { Tree } from '@nx/devkit';
import * as ts from 'typescript';
import { insertImport } from '@nx/workspace/src/generators/utils/insert-import';
import { addImportToModule } from '@nx/angular/src/utils/nx-devkit/ast-utils';

export function addImportsToAppModule(tree: Tree, options: any) {
  const modulePath = `apps/${options.name}/${options.name}-spa/src/app/app.module.ts`;
  const sourceText = tree.read(modulePath, 'utf-8');
  let sourceFile = ts.createSourceFile(
    modulePath,
    sourceText ? sourceText : '',
    ts.ScriptTarget.Latest,
    true
  );

  // routing imports
  insertImport(tree, './app-routing.module', 'AppRoutingModule', modulePath);

  sourceFile = addImportToModule(tree, sourceFile, modulePath, 'AppRoutingModule');
}
