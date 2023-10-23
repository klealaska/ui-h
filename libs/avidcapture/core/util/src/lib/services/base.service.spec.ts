import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { BaseAPIService } from './base.service';

const httpStub = {
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
};

describe('BaseAPIService', () => {
  let service: BaseAPIService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BaseAPIService],
    });
    service = new BaseAPIService(httpStub as any);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('get()', () => {
    describe('success', () => {
      it('should return a value', done => {
        httpStub.get.mockReturnValue(of({}));
        service['get']('').subscribe(value => {
          expect(value).toEqual({});
          done();
        });
      });
    });

    describe('error', () => {
      it('should catch the error', done => {
        httpStub.get.mockReturnValue(throwError(() => ({ status: 500 })));
        service['get']('').subscribe({
          next: () => {
            return;
          },
          error: err => {
            expect(err).toEqual({ status: 500 });
            done();
          },
        });
      });
    });
  });

  describe('getFileBlob()', () => {
    describe('success', () => {
      it('should return a value', done => {
        httpStub.get.mockReturnValue(of({}));
        service['getFileBlob']('').subscribe(value => {
          expect(value).toEqual({});
          done();
        });
      });
    });

    describe('error', () => {
      it('should catch the error', done => {
        httpStub.get.mockReturnValue(throwError(() => ({ status: 500 })));
        service['getFileBlob']('').subscribe({
          next: () => {
            return;
          },
          error: err => {
            expect(err).toEqual({ status: 500 });
            done();
          },
        });
      });
    });
  });

  describe('post()', () => {
    describe('success', () => {
      it('should return a value', done => {
        httpStub.post.mockReturnValue(of({}));
        service['post']('', {}).subscribe(value => {
          expect(value).toEqual({});
          done();
        });
      });
    });

    describe('error', () => {
      it('should catch the error', done => {
        httpStub.post.mockReturnValue(throwError(() => ({ status: 500 })));
        service['post']('', {}).subscribe({
          next: () => {
            return;
          },
          error: err => {
            expect(err).toEqual({ status: 500 });
            done();
          },
        });
      });
    });
  });

  describe('put()', () => {
    describe('success', () => {
      it('should return a value', done => {
        httpStub.put.mockReturnValue(of({}));
        service['put']('', {}).subscribe(value => {
          expect(value).toEqual({});
          done();
        });
      });
    });

    describe('error', () => {
      it('should catch the error', done => {
        httpStub.put.mockReturnValue(throwError(() => ({ status: 500 })));
        service['put']('', {}).subscribe({
          next: () => {
            return;
          },
          error: err => {
            expect(err).toEqual({ status: 500 });
            done();
          },
        });
      });
    });
  });

  describe('delete()', () => {
    describe('success', () => {
      it('should return a value', done => {
        httpStub.delete.mockReturnValue(of({}));
        service['delete']('').subscribe(value => {
          expect(value).toEqual({});
          done();
        });
      });
    });

    describe('error', () => {
      it('should catch the error', done => {
        httpStub.delete.mockReturnValue(throwError(() => ({ status: 500 })));
        service['delete']('').subscribe({
          next: () => {
            return;
          },
          error: err => {
            expect(err).toEqual({ status: 500 });
            done();
          },
        });
      });
    });
  });

  describe('deleteWithBody()', () => {
    describe('success', () => {
      it('should return a value', done => {
        httpStub.delete.mockReturnValue(of({}));
        service['deleteWithBody']('', {}).subscribe(value => {
          expect(value).toEqual({});
          done();
        });
      });
    });

    describe('error', () => {
      it('should catch the error', done => {
        httpStub.delete.mockReturnValue(throwError(() => ({ status: 500 })));
        service['deleteWithBody']('', {}).subscribe({
          next: () => {
            return;
          },
          error: err => {
            expect(err).toEqual({ status: 500 });
            done();
          },
        });
      });
    });
  });
});
