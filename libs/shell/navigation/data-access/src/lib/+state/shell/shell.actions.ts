import { createAction, props } from '@ngrx/store';
import { ShellEntity } from './shell.models';

export const initShell = createAction('[Shell Page] Init');

export const loadShellSuccess = createAction(
  '[Shell/API] Load Shell Success',
  props<{ shell: ShellEntity[] }>()
);

export const loadShellFailure = createAction(
  '[Shell/API] Load Shell Failure',
  props<{ error: any }>()
);
