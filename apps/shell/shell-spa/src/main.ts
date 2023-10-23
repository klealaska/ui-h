import { setRemoteDefinitions } from '@nx/angular/mf';

fetch('/assets/manifest/module-federation.manifest.json')
  .then(res => {
    return res.json();
  })
  // .then(res => res.data)
  .then(definitions => setRemoteDefinitions(definitions))
  .then(() => import('./bootstrap').catch(err => console.error(err)));
