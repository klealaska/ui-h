import { createAction, props } from '@ngrx/store';
import { ContentEntity } from './content.models';

export const initShellContent = createAction(
  '[Content Page] Init Shell',
  props<{ locale: string }>()
);

export const initContent = createAction('[Content Page] Init', props<{ locale: string }>());

export const initContentForProduct = createAction(
  '[Content Page] Init Product',
  props<{ productId: string }>()
);

export const loadContentSuccess = createAction(
  '[Content/API] Load Content Success',
  props<{ content: ContentEntity[] }>()
);

export const loadContentFailure = createAction(
  '[Content/API] Load Content Failure',
  props<{ error: any }>()
);
