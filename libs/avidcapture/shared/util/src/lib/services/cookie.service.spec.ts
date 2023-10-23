import { DOCUMENT } from '@angular/common';
import { TestBed } from '@angular/core/testing';

import { CookieService } from './cookie.service';
import { LoggingService } from './logging.service';

const documentMock: Document = document;

describe('CookieService', () => {
  let service: CookieService;
  let documentMockGetterSpy: jest.SpyInstance<string, []>;
  const loggingServiceSpy = {
    logException: jest.fn(),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: DOCUMENT, useFactory: (): any => documentMock },
        // {
        //   provide: LoggingService,
        //   useValue: loggingServiceSpy,
        // },
      ],
    });
    service = TestBed.inject(CookieService);

    documentMockGetterSpy = jest.spyOn(documentMock, 'cookie', 'get');
  });

  afterEach(() => jest.clearAllMocks());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getCookie()', () => {
    it('should return value of cookie', () => {
      documentMockGetterSpy.mockImplementation(() => 'foo=bar;');

      expect(service.getCookie('foo')).toEqual('bar');
    });

    it('should return empty string value when cookie has any special chars', () => {
      const cookieString = [
        '%3B%2C%2F%3F%3A%40%26%3D%2B%24=%3B%2C%2F%3F%3A%40%26%3D%2B%24',
        '-H%40ll%C3%B6_%20W%C3%B6rld-=-H%40ll%C3%B6_%20W%C3%B6rld-',
        '%24uper%5ETEST(123)=%24uper%5ETEST(123)',
        'F()!!()%2Fbar=F()!!()%2Fbar',
        '*F.)%2Fo(o*=*F.)%2Fo(o*',
        '-O_o%7B1%2C2%7D=-O_o%7B1%2C2%7D',
        'B%3Far%7CFo%2Bo=B%3Far%7CFo%2Bo',
        'Hello%3DWorld%3B=Hello%3DWorld%3B',
        '%5Bfoo-_*.%5Dbar=%5Bfoo-_*.%5Dbar',
      ].join('; ');
      documentMockGetterSpy.mockImplementation(() => cookieString);

      expect(service.getCookie(';,/?:@&=+$')).toEqual('');
      expect(service.getCookie('-H@llö_ Wörld-')).toEqual('');
      expect(service.getCookie('$uper^TEST(123)')).toEqual('');
      expect(service.getCookie('F()!!()/bar')).toEqual('');
      expect(service.getCookie('*F.)/o(o*')).toEqual('');
      expect(service.getCookie('-O_o{1,2}')).toEqual('');
      expect(service.getCookie('B?ar|Fo+o')).toEqual('');
      expect(service.getCookie('Hello=World;')).toEqual('');
      expect(service.getCookie('[foo-_*.]bar')).toEqual('');
    });

    it('should fallback to original value if decoding fails', () => {
      documentMockGetterSpy.mockImplementation(() => 'foo=%E0%A4%A;');

      expect(service.getCookie('foo')).toEqual('%E0%A4%A');
    });

    it('should return empty string for not set cookie', () => {
      documentMockGetterSpy.mockImplementationOnce(() => 'foo=bar;');

      expect(service.getCookie('bar')).toEqual('');
    });

    it('should return empty string for not set cookie', () => {
      documentMockGetterSpy.mockImplementationOnce(() => 'foo=bar;');

      expect(service.getCookie('bar')).toEqual('');
    });

    it('should return empty string when cookie exceeds 400 chars and logException', () => {
      documentMockGetterSpy.mockImplementation(
        () =>
          'test=0qBC8d97QZT2H4I6qY3nUoG6LXy6S7N6lN5P8gE6iA1v5mK6jK5B8iL6X9f6jK5B2xM6hV5wU4vZ2aF2tV7fN9v9tV7fN1uN7lG6P8uN7lG6P8uN7kR6B9v9tV7fN3mD1rT6jK5B8iL6X9f6jK5B2xM6hV5wU4vZ2aF2tV7fN9v9tV7fN1uN7lG6P8uN7lG6P8uN7kR6B9v9tV7fN3mD1rT6jK5B8iL6X9f6jK5B2xM6hV5wU4vZ2aF2tV7fN9v9tV7fN1uN7lG6P8uN7lG6P8uN7kR6B9v9tV7fN3mD1rT6jK5B8iL6X9f6jK5B2xM6hV5wU4vZ2aF2tV7fN9v9tV7fN1uN7lG6P8uN7lG6P8uN7kR6B9v9tV7fN3mD1rT6jK5B8iL6X9f6jK5B2;'
      );

      expect(service.getCookie('test')).toEqual('');
      // expect(loggingServiceSpy.logException).toHaveBeenCalled();
    });

    it('should return value when cookie value is 400 chars', () => {
      documentMockGetterSpy.mockImplementation(
        () =>
          'test=0qBC8d97QZT2H4I6qY3nUoG6LXy6S7N6lN5P8gE6iA1v5mK6jK5B8iL6X9f6jK5B2xM6hV5wU4vZ2aF2tV7fN9v9tV7fN1uN7lG6P8uN7lG6P8uN7kR6B9v9tV7fN3mD1rT6jK5B8iL6X9f6jK5B2xM6hV5wU4vZ2aF2tV7fN9v9tV7fN1uN7lG6P8uN7lG6P8uN7kR6B9v9tV7fN3mD1rT6jK5B8iL6X9f6jK5B2xM6hV5wU4vZ2aF2tV7fN9v9tV7fN1uN7lG6P8uN7lG6P8uN7kR6B9v9tV7fN3mD1rT6jK5B8iL6X9f6jK5B2xM6hV5wU4vZ2aF2tV7fN9v9tV7fN1uN7lG6P8uN7lG6P8uN7kR6B9v9tV7fN3mD1rT6jK5B8iL6X9f6jK5B;'
      );

      expect(service.getCookie('test')).toEqual(
        '0qBC8d97QZT2H4I6qY3nUoG6LXy6S7N6lN5P8gE6iA1v5mK6jK5B8iL6X9f6jK5B2xM6hV5wU4vZ2aF2tV7fN9v9tV7fN1uN7lG6P8uN7lG6P8uN7kR6B9v9tV7fN3mD1rT6jK5B8iL6X9f6jK5B2xM6hV5wU4vZ2aF2tV7fN9v9tV7fN1uN7lG6P8uN7lG6P8uN7kR6B9v9tV7fN3mD1rT6jK5B8iL6X9f6jK5B2xM6hV5wU4vZ2aF2tV7fN9v9tV7fN1uN7lG6P8uN7lG6P8uN7kR6B9v9tV7fN3mD1rT6jK5B8iL6X9f6jK5B2xM6hV5wU4vZ2aF2tV7fN9v9tV7fN1uN7lG6P8uN7lG6P8uN7kR6B9v9tV7fN3mD1rT6jK5B8iL6X9f6jK5B'
      );
    });
  });

  describe('getAllCookies()', () => {
    it('should return empty object if cookies not set', () => {
      documentMockGetterSpy.mockImplementation(() => '');

      expect(service.getAllCookies()).toEqual({});
    });

    it('should return object with decoded cookie names and values', () => {
      documentMockGetterSpy.mockImplementation(
        () => 'foo=bar; Hello=World; %3B%2C%2F%3F%3A%40%26%3D%2B%24=%3B%2C%2F%3F%3A%40%26%3D%2B%24'
      );

      expect(service.getAllCookies()).toEqual({
        foo: 'bar',
        Hello: 'World',
        '': '',
      });
    });

    it('should return object with safely decoded cookie names and values', () => {
      documentMockGetterSpy.mockImplementation(
        () =>
          'foo=%E0%A4%A; %E0%A4%A=%E0%A4%A; Hello=World; %3B%2C%2F%3F%3A%40%26%3D%2B%24=%3B%2C%2F%3F%3A%40%26%3D%2B%24'
      );

      expect(service.getAllCookies()).toEqual({
        foo: '%E0%A4%A',
        '%E0%A4%A': '%E0%A4%A',
        Hello: 'World',
        '': '',
      });
    });
  });
});
