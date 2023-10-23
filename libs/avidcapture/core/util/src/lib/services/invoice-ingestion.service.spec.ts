import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { SearchContext, InvoiceIngestionUrls, XdcApiUrls } from '@ui-coe/avidcapture/shared/types';

import { InvoiceIngestionService } from './invoice-ingestion.service';
import { getCompositeDataStub } from '../../../../../shared/test/src';

const environmentStub = {
  invoiceIngestionApiBaseUri: 'http://localhost:3000/',
} as any;

function getFileStub(fileName: string, isFile: boolean, fileSize: number): any {
  return {
    fileEntry: {
      file: jest.fn(cb =>
        cb({
          size: fileSize,
          name: fileName,
        })
      ),
      name: fileName,
      isFile,
    },
  };
}

describe('InvoiceIngestionService', () => {
  let ingestionService: InvoiceIngestionService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],

      providers: [
        InvoiceIngestionService,
        {
          provide: 'environment',
          useValue: environmentStub,
        },
      ],
    });

    ingestionService = TestBed.inject(InvoiceIngestionService);

    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(ingestionService).toBeTruthy();
  });

  it('should call POST file api', done => {
    const file = getFileStub('test.pdf', true, 12000);
    ingestionService
      .uploadInvoice(file, SearchContext.AvidSuite, '25', 'sourceEmail', 'correlationId')
      .subscribe(response => {
        expect(response).toBeDefined();
        done();
      });

    const req = httpMock.expectOne(
      `${environmentStub.invoiceIngestionApiBaseUri}${InvoiceIngestionUrls.POST_FILE}`
    );

    const requestBody = req.request.body as FormData;
    expect(requestBody.get('SourceEmail')).toEqual('sourceEmail');
    expect(requestBody.get('SourceOrganizationId')).toEqual('AvidSuite');
    expect(requestBody.get('OrganizationId')).toEqual('25');
    expect(requestBody.get('SourceInvoiceId')).toEqual(expect.any(String));
    expect(requestBody.get('SourceId')).toEqual('AvidSuite');
    expect(requestBody.get('File')).toBeDefined();
    expect(requestBody.get('Custom')).toBeDefined();

    expect(req.request.method).toEqual('POST');

    req.flush('');
  });

  it('should call POST file api for swapping invoice', done => {
    const file = getFileStub('test.pdf', true, 12000);
    const indexedData = getCompositeDataStub().indexed;

    ingestionService.swapInvoice(file, '25', 'sourceEmail', indexedData).subscribe(response => {
      expect(response).toBeDefined();
      done();
    });

    const req = httpMock.expectOne(`${environmentStub.apiBaseUri}${XdcApiUrls.POST_FILE}`);

    const requestBody = req.request.body as FormData;
    expect(requestBody.get('SourceEmail')).toEqual('sourceEmail');
    expect(requestBody.get('SourceOrganizationId')).toEqual('null');
    expect(requestBody.get('OrganizationId')).toEqual('25');
    expect(requestBody.get('SourceInvoiceId')).toEqual(expect.any(String));
    expect(requestBody.get('SourceId')).toEqual('AvidSuite');
    expect(requestBody.get('File')).toBeDefined();
    expect(requestBody.get('Custom')).toBeDefined();

    expect(req.request.method).toEqual('POST');

    req.flush('');
  });
});
