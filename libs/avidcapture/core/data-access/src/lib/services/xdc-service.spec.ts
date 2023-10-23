import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import {
  compositeDataStub,
  getAggregateBodyRequest,
  getCompositeDataStub,
  getDocuments,
  getSearchBodyRequest,
  usersStub,
} from '@ui-coe/avidcapture/shared/test';
import {
  CompositeDocument,
  IndexedData,
  IndexingUnitData,
  XdcApiUrls,
} from '@ui-coe/avidcapture/shared/types';

import { XdcService } from './xdc.service';

const environmentStub = {
  apiBaseUri: 'http://idcapi.avidxchange.com/',
};

describe('XdcService', () => {
  let xdcService: XdcService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        XdcService,
        {
          provide: 'environment',
          useValue: environmentStub,
        },
      ],
    });

    xdcService = TestBed.inject(XdcService);

    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockedIndexed: IndexedData = {
    documentId: '1',
    fileId: '1',
    indexer: 'indexer',
    dateReceived: '2020-10-28T16:39:40.237Z',
    lastModified: '2020-10-29T16:39:40.237Z',
    labels: [
      {
        id: '00000000-0000-0000-0000-000000000000',
        label: 'label test',
        value: {
          text: 'text value',
          confidence: 0,
          boundingBox: [0.2, 0.3, 0.4],
          verificationState: 'state',
          required: true,
          incomplete: false,
          incompleteReason: '',
          type: '',
        },
        page: 0,
      },
    ],
    activities: [
      {
        ordinal: 0,
        startDate: '2020-10-28T16:39:40.237Z',
        endDate: '2020-10-28T16:39:40.237Z',
        indexer: 'string',
        activity: 'string',
        changeLog: [],
        description: 'string',
        escalation: {
          category: { issue: 'string', reason: 'string' },
          description: 'string',
          escalationLevel: 'string',
          resolution: 'string',
        },
        labels: [],
      },
    ],
  };

  const mockedUnindexed: CompositeDocument = {
    indexed: mockedIndexed,
    unindexed: {
      documentId: 'string',
      fileId: 'string',
      indexer: 'string',
      dateReceived: '2020-10-29T16:44:51.860Z',
      pages: [
        {
          number: 1,
          lines: [
            {
              number: 4,
              words: [
                {
                  label: 'text',
                  value: 'value',
                  boundingBox: [0, 1, 2],
                  confidence: 4,
                },
              ],
            },
          ],
        },
      ],
    },
    userLock: {
      id: 'string',
      documentId: 'string',
      indexer: 'string',
      startTime: '2020-10-29T16:44:51.860Z',
    },
  };

  const mockedIndexingUnit: IndexingUnitData = {
    indexed: mockedIndexed,
    unindexed: mockedUnindexed.unindexed,
  };

  const parseUrlParams = (url: string, params: any): string => {
    const parameters = Object.keys(params);

    parameters.forEach(param => {
      url = url.replace(`{${param}}`, params[param]);
    });

    return url;
  };

  it('should get an archived document', done => {
    const archivedDocument = getCompositeDataStub();

    xdcService.getArchivedDocument('1').subscribe(response => {
      expect(response).toEqual(archivedDocument);
      done();
    });

    const req = httpMock.expectOne(
      parseUrlParams(`${environmentStub.apiBaseUri}${XdcApiUrls.GET_ARCHIVED_DOCUMENT}`, {
        documentId: '1',
        userId: 'mockName',
      })
    );
    expect(req.request.method).toEqual('GET');

    req.flush(archivedDocument);
  });

  it('should return boolean value from locked document service', done => {
    xdcService.unlockDocument('12345').subscribe(response => {
      expect(response).toBeDefined();
      done();
    });

    const req = httpMock.expectOne(
      parseUrlParams(`${environmentStub.apiBaseUri}${XdcApiUrls.LOCK}`, {
        documentId: '12345',
      })
    );
    expect(req.request.method).toEqual('DELETE');

    req.flush(true);
  });

  it('should call the lock document api', done => {
    xdcService.lockDocument('12345').subscribe(response => {
      expect(response).toBeDefined();
      done();
    });

    const req = httpMock.expectOne(
      parseUrlParams(`${environmentStub.apiBaseUri}${XdcApiUrls.LOCK}`, {
        documentId: '12345',
      })
    );
    expect(req.request.method).toEqual('PUT');

    req.flush(true);
  });

  it('should get the delete indexed service', done => {
    xdcService.putIndexedSubmit(compositeDataStub.indexed).subscribe(response => {
      expect(response).toBeDefined();
      done();
    });

    const req = httpMock.expectOne(`${environmentStub.apiBaseUri}${XdcApiUrls.PUT_INDEXED_SUBMIT}`);
    expect(req.request.method).toEqual('PUT');

    req.flush('');
  });

  it('should put indexed data to document service', done => {
    xdcService.putIndexed(mockedIndexed).subscribe(response => {
      expect(response).toEqual(mockedIndexed);
      done();
    });

    const req = httpMock.expectOne(`${environmentStub.apiBaseUri}${XdcApiUrls.PUT_INDEXED}`);
    expect(req.request.method).toEqual('PUT');

    req.flush(mockedIndexed);
  });

  it('should get put escalation from service', done => {
    xdcService.putEscalation(compositeDataStub.indexed).subscribe(response => {
      expect(response).toBeDefined();
      done();
    });

    const req = httpMock.expectOne(`${environmentStub.apiBaseUri}${XdcApiUrls.PUT_ESCALATION}`);
    expect(req.request.method).toEqual('PUT');

    req.flush('');
  });

  it('should post a new indexingunit data to xdc service', done => {
    xdcService.postIndexingUnit(mockedIndexingUnit).subscribe(response => {
      expect(response).toBeDefined();
      done();
    });

    const req = httpMock.expectOne(`${environmentStub.apiBaseUri}${XdcApiUrls.POST_INDEXINGUNIT}`);
    expect(req.request.method).toEqual('POST');

    req.flush(mockedIndexingUnit);
  });

  it('should get unindexed data for by user from service', done => {
    const documentId = '12345';
    const userId = 'userId';

    xdcService.getUnindexedDocument(documentId, userId).subscribe(response => {
      expect(response).toEqual(compositeDataStub);
      done();
    });

    const req = httpMock.expectOne(
      parseUrlParams(`${environmentStub.apiBaseUri}${XdcApiUrls.GET_UNINDEXED_DOCUMENT}`, {
        userId,
        documentId: '12345',
      })
    );
    expect(req.request.method).toEqual('GET');

    req.flush(compositeDataStub);
  });

  describe('getNextUnindexedDocument()', () => {
    const bodyRequestMock = getAggregateBodyRequest({ buyerId: '25' } as any);

    afterEach(() => {
      httpMock.verify();
    });

    it('should post to get the next unindexed document to xdc service with all params', done => {
      xdcService.getNextUnindexedDocument('mockUsername', bodyRequestMock).subscribe(res => {
        expect(res).toEqual(compositeDataStub);
        done();
      });

      const req = httpMock.expectOne(
        parseUrlParams(`${environmentStub.apiBaseUri}${XdcApiUrls.GET_NEXT_DOCUMENT}`, {
          userId: 'mockUsername',
          includeEscalations: true,
          currentDocumentId: 'test',
        })
      );

      expect(req.request.method).toEqual('POST');
      expect(req.request.body).toStrictEqual(bodyRequestMock);
      req.flush(compositeDataStub);
    });

    it('should handle null value for includeEscalations', done => {
      xdcService.getNextUnindexedDocument('mockUsername', {} as any).subscribe(res => {
        expect(res).toEqual(compositeDataStub);
        done();
      });

      const req = httpMock.expectOne(
        parseUrlParams(`${environmentStub.apiBaseUri}${XdcApiUrls.GET_NEXT_DOCUMENT}`, {
          userId: 'mockUsername',
          includeEscalations: false,
          bodyRequest: { orderBy: {}, filters: {} },
          currentDocumentId: '',
        })
      );

      req.flush(compositeDataStub);
    });

    it('should handle undefined value for includeEscalations', done => {
      xdcService.getNextUnindexedDocument('mockUsername', {} as any).subscribe(res => {
        expect(res).toEqual(compositeDataStub);
        done();
      });

      const req = httpMock.expectOne(
        parseUrlParams(`${environmentStub.apiBaseUri}${XdcApiUrls.GET_NEXT_DOCUMENT}`, {
          userId: 'mockUsername',
          includeEscalations: false,
          bodyRequest: { orderBy: [], filters: {} },
          currentDocumentId: '',
        })
      );

      req.flush(compositeDataStub);
    });
  });

  describe('postAggregateSearch', () => {
    const bodyMock = getAggregateBodyRequest({ buyerId: [] });
    const documentStub = getDocuments();

    it('should get recycleBin documents', done => {
      xdcService.postAggregateSearch(bodyMock).subscribe(response => {
        expect(response).toEqual(documentStub);
        done();
      });

      const req = httpMock.expectOne(`${environmentStub.apiBaseUri}${XdcApiUrls.POST_AGGREGATE}`);
      expect(req.request.method).toEqual('POST');
      req.flush(documentStub);
    });
  });

  describe('postAggregateBulkSearch', () => {
    const bodyMock = getAggregateBodyRequest({ buyerId: [] });
    const documentStub = getDocuments();

    it('should return bulk aggregate results', done => {
      xdcService.postAggregateBulkSearch([bodyMock]).subscribe(response => {
        expect(response).toEqual(documentStub);
        done();
      });

      const req = httpMock.expectOne(
        `${environmentStub.apiBaseUri}${XdcApiUrls.POST_BULK_AGGREGATE}`
      );
      expect(req.request.method).toEqual('POST');
      req.flush(documentStub);
    });
  });

  describe('postSearch', () => {
    const bodyMock = getSearchBodyRequest({ buyerId: [] });
    const documentStub = getDocuments();

    it('should get recycleBin documents', done => {
      xdcService.postSearch(bodyMock).subscribe(response => {
        expect(response).toEqual(documentStub);
        done();
      });

      const req = httpMock.expectOne(`${environmentStub.apiBaseUri}${XdcApiUrls.POST_SEARCH}`);
      expect(req.request.method).toEqual('POST');
      req.flush(documentStub);
    });
  });

  describe('getUsers', () => {
    it('should get Users', done => {
      xdcService.getUsers().subscribe(response => {
        expect(response).toEqual(usersStub);
        done();
      });

      const req = httpMock.expectOne(`${environmentStub.apiBaseUri}${XdcApiUrls.GET_ADMIN_USERS}`);
      expect(req.request.method).toEqual('GET');
      req.flush(usersStub);
    });
  });

  describe('downloadFile', () => {
    it('should get file', done => {
      xdcService.getFile('1').subscribe(response => {
        expect(response).toEqual(new Blob());
        done();
      });

      const req = httpMock.expectOne(
        parseUrlParams(`${environmentStub.apiBaseUri}${XdcApiUrls.GET_FILE}`, {
          documentId: '1',
        })
      );
      expect(req.request.method).toEqual('GET');

      req.flush(new Blob());
    });
  });
});
