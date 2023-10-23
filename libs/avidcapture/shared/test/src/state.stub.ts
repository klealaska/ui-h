/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { State } from '@ngxs/store';

import { fieldBaseStub, formGroupInstanceStub } from './test.stub';

@State<any>({
  name: 'indexingDocumentFields',
  defaults: {
    formattedFields: fieldBaseStub,
    fieldGroupInstance: formGroupInstanceStub,
  },
})
@Injectable()
export class IndexingDocumentFieldsStateMock {}

@State<any>({
  name: 'core',
  defaults: {
    featureFlags: [],
    token: null,
    orgIds: [],
    orgNames: [],
  },
})
@Injectable()
export class CoreStateMock {}

@State<any>({
  name: 'indexingPage',
  defaults: {
    buyerId: 25,
  },
})
@Injectable()
export class IndexingPageMock {}
