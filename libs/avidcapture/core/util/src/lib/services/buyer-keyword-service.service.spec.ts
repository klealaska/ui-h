import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import {
  BuyerKeywordServiceApiUrls,
  RejectToSenderPayload,
  RejectToSenderTemplate,
  SearchBodyRequest,
} from '@ui-coe/avidcapture/shared/types';

import { BuyerKeywordService } from './buyer-keyword-service.service';

const environmentStub = {
  bkwsBaseUri: 'https://api.devavidxcloud.com/v1/buyerkeywordservice/',
};

const parseUrlParams = (url: string, params: any): string => {
  const parameters = Object.keys(params);

  parameters.forEach(param => {
    url = url.replace(`{${param}}`, params[param]);
  });

  return url;
};

describe('BuyerKeywordService', () => {
  let service: BuyerKeywordService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        BuyerKeywordService,
        {
          provide: 'environment',
          useValue: environmentStub,
        },
      ],
    });

    service = TestBed.inject(BuyerKeywordService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should post a reject to sender to the bkws', done => {
    const payloadStub: RejectToSenderPayload = {
      toEmailAddress: 'mock@mock.com',
      templateId: 2481,
      submitterEmailAddress: 'mock1@mock.com',
      fileId: 0,
      dateReceived: '2022-04-23T18:25:43.511Z',
    };

    service.postRejectToSender(payloadStub).subscribe(response => {
      expect(response).toBeDefined();
      done();
    });

    const req = httpMock.expectOne(
      `${environmentStub.bkwsBaseUri}${BuyerKeywordServiceApiUrls.POST_REJECT_TO_SENDER}`
    );
    expect(req.request.method).toEqual('POST');

    req.flush(null);
  });

  it('should post a reject to sender templates to the bkws', done => {
    const templateStub: RejectToSenderTemplate[] = [
      {
        templateId: '2341',
        sourceSystemId: '25',
        sourceSystemBuyerId: '1',
        templateName: 'mock',
        templateSubjectLine: 'mock',
        notificationTemplate: 'mock',
        isActive: true,
      },
    ];

    service.postRejectToSenderTemplates(25).subscribe(response => {
      expect(response).toBeDefined();
      done();
    });

    const req = httpMock.expectOne(
      parseUrlParams(
        `${environmentStub.bkwsBaseUri}${BuyerKeywordServiceApiUrls.POST_REJECT_TO_SENDER_TEMPLATES}`,
        {
          buyerId: 25,
        }
      )
    );

    expect(req.request.method).toEqual('POST');
    req.flush(templateStub);
  });

  it('should post a new reject to sender template to the bkws', done => {
    const templateStub: RejectToSenderTemplate = {
      sourceSystemBuyerId: '25',
      sourceSystemId: 'AvidSuite',
      templateName: 'Mock',
      templateSubjectLine: 'Shmock',
      notificationTemplate: '<html>nonsense</html>',
      isActive: true,
    };

    service.postRejectToSenderCreate(templateStub).subscribe(response => {
      expect(response).toBeDefined();
      done();
    });

    const req = httpMock.expectOne(
      `${environmentStub.bkwsBaseUri}${BuyerKeywordServiceApiUrls.POST_REJECT_TO_SENDER_CREATE}`
    );

    expect(req.request.method).toEqual('POST');
    req.flush(null);
  });

  it('should post an edit for a reject to sender template to the bkws', done => {
    const templateStub: RejectToSenderTemplate = {
      sourceSystemBuyerId: '25',
      sourceSystemId: 'AvidSuite',
      templateName: 'Mock',
      templateSubjectLine: 'Shmock',
      notificationTemplate: '<html>nonsense</html>',
      isActive: true,
      templateId: '1',
    };

    service.postRejectToSenderEdit(templateStub).subscribe(response => {
      expect(response).toBeDefined();
      done();
    });

    const req = httpMock.expectOne(
      `${environmentStub.bkwsBaseUri}${BuyerKeywordServiceApiUrls.POST_REJECT_TO_SENDER_EDIT}`
    );

    expect(req.request.method).toEqual('POST');
    req.flush(null);
  });

  it('should post a delete for a reject to sender template to the bkws', done => {
    service.postRejectToSenderDelete('1').subscribe(response => {
      expect(response).toBeDefined();
      done();
    });

    const req = httpMock.expectOne(
      parseUrlParams(
        `${environmentStub.bkwsBaseUri}${BuyerKeywordServiceApiUrls.POST_REJECT_TO_SENDER_DELETE}`,
        {
          templateId: 1,
        }
      )
    );

    expect(req.request.method).toEqual('POST');
    req.flush(null);
  });

  it('should post a postAggregateSearch to the bkws', done => {
    const payloadStub: SearchBodyRequest = { Controls: { SourceId: 'Avid' } };

    service.postAggregateSearch(payloadStub).subscribe(response => {
      expect(response).toBeDefined();
      done();
    });

    const req = httpMock.expectOne(
      `${environmentStub.bkwsBaseUri}${BuyerKeywordServiceApiUrls.POST_SEARCH}/${BuyerKeywordServiceApiUrls.POST_AGGREGATE}`
    );
    expect(req.request.method).toEqual('POST');

    req.flush(null);
  });
});
