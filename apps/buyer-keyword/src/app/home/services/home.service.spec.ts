import { HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { environment } from '../../../environments/environment';
import {
  getBuyerPayloadStub,
  getBuyersStub,
  getSearchBodyRequest,
} from '../../../testing/test-stubs';
import { AppsUrls, BkwsUrls } from '../../shared/enums';
import { BuyerPayload, MassVoidBodyRequest, SearchBodyRequest } from '../../shared/interfaces';
import { HomeService } from './home.service';

describe('HomeService', () => {
  let service: HomeService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [HomeService],
    });

    service = TestBed.inject(HomeService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getBuyers()', () => {
    const buyersStub = getBuyersStub();
    const searchBodyRequestStub: SearchBodyRequest = getSearchBodyRequest({
      sourceSystemBuyerId: ['25'],
    });

    describe('when successful', () => {
      it('should get a list of buyers for the home page', done => {
        service.getBuyers(searchBodyRequestStub).subscribe(response => {
          expect(response).toEqual(buyersStub);
          done();
        });

        const req = httpMock.expectOne(
          `${environment.apiBaseUri}${AppsUrls.BKWS}${BkwsUrls.POST_SEARCH}`
        );
        expect(req.request.method).toEqual('POST');

        req.flush(buyersStub);
      });
    });

    describe('when unsuccessful', () => {
      it('should throw an error', done => {
        const mockErrorResponse = { status: 400, statusText: 'Bad Request' };
        const data = 'Invalid request parameters';
        const searchBodyRequestStub: SearchBodyRequest = getSearchBodyRequest({
          sourceSystemBuyerId: ['25'],
        });

        service.getBuyers(searchBodyRequestStub).subscribe(
          () => fail('Should have failed with 400 error'),
          (error: HttpErrorResponse) => {
            expect(error.status).toEqual(400);
            expect(error.error).toContain('Invalid request parameters');
            done();
          }
        );

        const req = httpMock.expectOne(
          `${environment.apiBaseUri}${AppsUrls.BKWS}${BkwsUrls.POST_SEARCH}`
        );
        expect(req.request.method).toEqual('POST');

        req.flush(data, mockErrorResponse);
      });
    });
  });

  describe('updateBuyer()', () => {
    const buyerPayloadStub: BuyerPayload = getBuyerPayloadStub();

    describe('when successful', () => {
      it('should update buyer service information', done => {
        service.updateBuyer(buyerPayloadStub).subscribe(response => {
          expect(response).toEqual(buyerPayloadStub);
          done();
        });

        const req = httpMock.expectOne(
          `${environment.apiBaseUri}${AppsUrls.BKWS}${BkwsUrls.UPDATE_BUYERS}`
        );
        expect(req.request.method).toEqual('POST');

        req.flush(buyerPayloadStub);
      });
    });

    describe('when unsuccessful', () => {
      it('should throw an error', done => {
        const mockErrorResponse = { status: 400, statusText: 'Bad Request' };
        const data = 'Invalid request parameters';

        service.updateBuyer(buyerPayloadStub).subscribe(
          () => fail('Should have failed with 400 error'),
          (error: HttpErrorResponse) => {
            expect(error.status).toEqual(400);
            expect(error.error).toContain('Invalid request parameters');
            done();
          }
        );

        const req = httpMock.expectOne(
          `${environment.apiBaseUri}${AppsUrls.BKWS}${BkwsUrls.UPDATE_BUYERS}`
        );
        expect(req.request.method).toEqual('POST');

        req.flush(data, mockErrorResponse);
      });
    });
  });

  describe('getAggregateSearch()', () => {
    const buyersStub = getBuyersStub();
    const searchBodyRequestStub: SearchBodyRequest = getSearchBodyRequest({
      sourceSystemBuyerId: ['25'],
    });

    describe('when successful', () => {
      it('should get a list of buyers for the home page', done => {
        service.getAggregateSearch(searchBodyRequestStub).subscribe(response => {
          expect(response).toEqual(buyersStub);
          done();
        });

        const req = httpMock.expectOne(
          `${environment.apiBaseUri}${AppsUrls.BKWS}${BkwsUrls.POST_SEARCH}${BkwsUrls.POST_AGGREGATE}`
        );
        expect(req.request.method).toEqual('POST');

        req.flush(buyersStub);
      });
    });

    describe('when unsuccessful', () => {
      it('should throw an error', done => {
        const mockErrorResponse = { status: 400, statusText: 'Bad Request' };
        const data = 'Invalid request parameters';
        const searchBodyRequestStub: SearchBodyRequest = getSearchBodyRequest({
          sourceSystemBuyerId: ['25'],
        });

        service.getAggregateSearch(searchBodyRequestStub).subscribe(
          () => fail('Should have failed with 400 error'),
          (error: HttpErrorResponse) => {
            expect(error.status).toEqual(400);
            expect(error.error).toContain('Invalid request parameters');
            done();
          }
        );

        const req = httpMock.expectOne(
          `${environment.apiBaseUri}${AppsUrls.BKWS}${BkwsUrls.POST_SEARCH}${BkwsUrls.POST_AGGREGATE}`
        );
        expect(req.request.method).toEqual('POST');

        req.flush(data, mockErrorResponse);
      });
    });
  });

  describe('massVoid()', () => {
    describe('when successful', () => {
      const searchBodyRequestStub: MassVoidBodyRequest = {
        buyerId: '',
        sourceId: '',
        startDate: '',
        endDate: '',
      };
      it('should call massiveVoid', done => {
        service.massVoid(searchBodyRequestStub).subscribe(response => {
          expect(response).toBeDefined();
          done();
        });

        const req = httpMock.expectOne(
          `${environment.apiBaseUri}${AppsUrls.AVID_CAPTURE}${BkwsUrls.MASS_VOID}`
        );
        expect(req.request.method).toEqual('POST');
        req.flush(true);
      });
    });
  });

  describe('when unsuccessful', () => {
    it('should throw an error', done => {
      const mockErrorResponse = { status: 400, statusText: 'Bad Request' };
      const data = 'Invalid request parameters';
      const searchBodyRequestStub: MassVoidBodyRequest = {
        buyerId: '',
        sourceId: '',
        startDate: '',
        endDate: '',
      };

      service.massVoid(searchBodyRequestStub).subscribe(
        () => fail('Should have failed with 400 error'),
        (error: HttpErrorResponse) => {
          expect(error.status).toEqual(400);
          expect(error.error).toContain('Invalid request parameters');
          done();
        }
      );

      const req = httpMock.expectOne(
        `${environment.apiBaseUri}${AppsUrls.AVID_CAPTURE}${BkwsUrls.MASS_VOID}`
      );
      expect(req.request.method).toEqual('POST');

      req.flush(data, mockErrorResponse);
    });
  });
});
