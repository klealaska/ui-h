import { camelCaseObjectKeys, generalObjectMapper } from './mapping.utils';

describe('Mapping utils', () => {
  it('should correctly map object keys', () => {
    const obj = { a_b: [{ b_c: 1 }] };

    expect(camelCaseObjectKeys(obj)).toEqual({ aB: [{ bC: 1 }] });
  });

  it('should return the input if it is a primitive value', () => {
    expect(camelCaseObjectKeys(1)).toBe(1);
  });

  it('should return the correct object type', () => {
    const err = {
      message: 'foo',
      code: 'bar',
      response: {
        status: 'baz',
        statusText: 'raz',
        data: 'rar',
      },
    };
    const obj = {
      message: 'message',
      code: 'code',
      status: 'response.status',
      statusText: 'response.statusText',
      data: 'response.data',
    };
    const expectedObj = {
      message: 'foo',
      code: 'bar',
      status: 'baz',
      statusText: 'raz',
      data: 'rar',
    };
    expect(generalObjectMapper(err, obj)).toEqual(expectedObj);
  });
});
