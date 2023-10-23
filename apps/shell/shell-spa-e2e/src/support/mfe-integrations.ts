export const cmsUrl = {
  url: '/api/all*',
  method: 'GET',
};

export const manifestUrl = {
  url: '/assets/manifest/module-federation.manifest.json',
  method: 'GET',
};

export const clearConfigCache = () => {
  cy.intercept('/assets/config/app.config.json', { middleware: true }, req => {
    req.on('before:response', res => {
      // force all API responses to not be cached
      res.headers['cache-control'] = 'no-store';
    });
  });
};

export const verifyResponse200 = (reqAlias: string) => {
  cy.wait(reqAlias).then(interception => {
    assert.equal(interception?.response?.statusCode, 200);
  });
};

export const getNavHeader = () => cy.get('[data-cy="shell-nav-header"]');

export const getNavMenuButton = () => cy.get('[data-cy="shell-nav-menu-btn"]');

export const getNavHomeButton = () => cy.get('[data-cy="shell-nav-home-btn"]');

// Click on MFE link in nav menu based on list id param
export const navigateToMfeById = (id: string) => {
  cy.intercept({ method: 'GET', url: '/assets/config/app.config.json' }).as('configCheck');

  getNavMenuButton().click();
  cy.get(`[data-cy="mfe-btn-${id}"]`).click();

  // Verify app config loads
  verifyResponse200('@configCheck');
};
