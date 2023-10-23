import { ShellEntity } from './shell.models';
import { shellAdapter, ShellPartialState, initialShellState } from './shell.reducer';
import * as ShellSelectors from './shell.selectors';

describe('Shell Selectors', () => {
  const ERROR_MSG = 'No Error Available';
  const getShellId = (it: ShellEntity) => it.id;
  const createShellEntity = (id: string, name = '') =>
    ({
      id,
      name: name || `name-${id}`,
    } as ShellEntity);

  let state: ShellPartialState;

  beforeEach(() => {
    state = {
      shell: shellAdapter.setAll(
        [
          createShellEntity('PRODUCT-AAA'),
          createShellEntity('PRODUCT-BBB'),
          createShellEntity('PRODUCT-CCC'),
        ],
        {
          ...initialShellState,
          selectedId: 'PRODUCT-BBB',
          error: ERROR_MSG,
          loaded: true,
        }
      ),
    };
  });

  describe('Shell Selectors', () => {
    it('selectAllShell() should return the list of Shell', () => {
      const results = ShellSelectors.selectAllShell(state);
      const selId = getShellId(results[1]);

      expect(results.length).toBe(3);
      expect(selId).toBe('PRODUCT-BBB');
    });

    it('selectEntity() should return the selected Entity', () => {
      const result = ShellSelectors.selectEntity(state) as ShellEntity;
      const selId = getShellId(result);

      expect(selId).toBe('PRODUCT-BBB');
    });

    it('selectShellLoaded() should return the current "loaded" status', () => {
      const result = ShellSelectors.selectShellLoaded(state);

      expect(result).toBe(true);
    });

    it('selectShellError() should return the current "error" state', () => {
      const result = ShellSelectors.selectShellError(state);

      expect(result).toBe(ERROR_MSG);
    });
  });
});
