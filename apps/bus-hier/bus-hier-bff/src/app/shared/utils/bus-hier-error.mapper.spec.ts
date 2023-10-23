import { busHierErrorMapper } from './bus-hier-error.mapper';

describe('Business Hierarchy error mapper', () => {
  it('should correctly map an error response', () => {
    const err = {
      message: 'foo',
      code: 'foo.bar',
      response: {
        status: 400,
        statusText: 'ERR_BAD_REQUEST',
        data: 'foo',
      },
    };

    const parsedError = {
      message: 'foo',
      code: 'foo.bar',
      status: 400,
      statusText: 'ERR_BAD_REQUEST',
      data: 'foo',
    };

    expect(busHierErrorMapper(err)).toEqual(parsedError);
  });

  it('should return undefined for undefined values and not throw an error', () => {
    const undefinedError = {
      message: undefined,
      code: undefined,
      status: undefined,
      statusText: undefined,
      data: undefined,
    };
    expect(busHierErrorMapper({})).toEqual(undefinedError);
  });

  it('should return undefined for an undefined err and not throw an error', () => {
    const undefinedError = {
      message: undefined,
      code: undefined,
      status: undefined,
      statusText: undefined,
      data: undefined,
    };
    expect(busHierErrorMapper(undefined)).toEqual(undefinedError);
  });
});
