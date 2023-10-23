import { NgModule } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule, Store } from '@ngrx/store';
import { readFirst } from '@nx/angular/testing';

import * as ShellActions from './shell.actions';
import { ShellEffects } from './shell.effects';
import { ShellFacade } from './shell.facade';
import { ShellEntity } from './shell.models';
import { SHELL_FEATURE_KEY, ShellState, initialShellState, shellReducer } from './shell.reducer';
import * as ShellSelectors from './shell.selectors';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ContentFacade } from '@ui-coe/shared/data-access/content';
import { LoggingService } from '@ui-coe/shared/util/services';

interface TestSchema {
  shell: ShellState;
}

describe('ShellFacade', () => {
  let facade: ShellFacade;
  let store: Store<TestSchema>;
  const createShellEntity = (id: string, name = ''): ShellEntity => ({
    id,
    name: name || `name-${id}`,
  });

  describe('used in NgModule', () => {
    beforeEach(() => {
      @NgModule({
        imports: [
          HttpClientTestingModule,
          StoreModule.forFeature(SHELL_FEATURE_KEY, shellReducer),
          EffectsModule.forFeature([ShellEffects]),
        ],
        providers: [ShellFacade, ContentFacade, LoggingService],
      })
      class CustomFeatureModule {}

      @NgModule({
        imports: [StoreModule.forRoot({}), EffectsModule.forRoot([]), CustomFeatureModule],
      })
      class RootModule {}
      TestBed.configureTestingModule({ imports: [RootModule] });

      store = TestBed.inject(Store);
      facade = TestBed.inject(ShellFacade);
    });

    /**
     * The initially generated facade::loadAll() returns empty array
     */
    it('loadAll() should return empty list with loaded == true', async () => {
      let list = await readFirst(facade.allShell$);
      let isLoaded = await readFirst(facade.loaded$);

      expect(list.length).toBe(0);
      expect(isLoaded).toBe(false);

      facade.init();

      list = await readFirst(facade.allShell$);
      isLoaded = await readFirst(facade.loaded$);

      expect(list.length).toBe(0);
      expect(isLoaded).toBe(true);
    });

    /**
     * Use `loadShellSuccess` to manually update list
     */
    it('allShell$ should return the loaded list; and loaded flag == true', async () => {
      let list = await readFirst(facade.allShell$);
      let isLoaded = await readFirst(facade.loaded$);

      expect(list.length).toBe(0);
      expect(isLoaded).toBe(false);

      store.dispatch(
        ShellActions.loadShellSuccess({
          shell: [createShellEntity('AAA'), createShellEntity('BBB')],
        })
      );

      list = await readFirst(facade.allShell$);
      isLoaded = await readFirst(facade.loaded$);

      expect(list.length).toBe(2);
      expect(isLoaded).toBe(true);
    });
  });
});
