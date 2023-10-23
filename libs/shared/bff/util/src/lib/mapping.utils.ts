import { camelCase, snakeCase, set, get } from 'lodash';

export function camelCaseObjectKeys<T, D>(obj: T): D {
  return shiftObjectKeyCase<T, D>(obj, camelCase);
}

export function snakeCaseObjectKeys<T, D>(obj: T): D {
  return shiftObjectKeyCase<T, D>(obj, snakeCase);
}

/**
 * @function shiftObjectKeyCase
 * @description receives and object and a transformation function and will transform the object's keys using the given function
 * @param obj the object whose keys will be transformed
 * @param fn the function that will do the transformation (currently intended to be used with lodash's camelCase and snakeCase)
 * @returns a new object with the keys transformed by the given function
 */
function shiftObjectKeyCase<T, D>(obj: T, fn: (objectKey: string) => string): D {
  const newObj = {};

  if (Array.isArray(obj)) {
    // setting the type here to appease the linter
    return obj.map(item => shiftObjectKeyCase(item, fn)) as unknown as D;
  } else if (typeof obj === 'object') {
    Object.keys(obj).forEach(key => {
      if (obj[key] && typeof obj[key] === 'object') {
        newObj[fn(key)] = shiftObjectKeyCase(obj[key], fn);
      } else {
        newObj[fn(key)] = obj[key];
      }
    });
  } else {
    // if obj happens to be a primitive value because of the recursive calls
    // we will just return it
    // setting the type this way to appease the linter
    return obj as unknown as D;
  }

  return newObj as D;
}

/**
 * @function generalObjectMapper
 * @description a function to create a new object from a given source object that will have the shape given by
 * a configuration object whose keys will be the keys (or path to the keys) of the new object
 * and whose values will be the stringified paths to the values in the source object
 * @example given the following:
 *
 *          interface IData {
 *            data: {
 *              id: string;
 *            };
 *            cmpId: string;
 *            status: string;
 *          }
 *
 *          const sourceData: IData = {
 *            data: {
 *              id: '123',
 *            },
 *            cmpId: 'abc123',
 *            status: 'active',
 *          }
 *
 *          interface IObj = {
 *            id: 'string',
 *            cmp: {
 *              id: 'string';
 *            };
 *            status: 'string',
 *          };
 *
 *          const config = {
 *            id: 'data.id',
 *            'cmp.id': 'cmpId',
 *            status: 'status',
 *          };
 *
 *          the following call:
 *          generalObjectMapper<IData, IObj>(sourceData, config);
 *          will return a new object with the shape of IObj and with the data from sourceData:
 *          {
 *            id: '123',
 *            cmp: {
 *              id: 'abc123',
 *            },
 *            status: 'active',
 *          }
 * @param sourceObj `T` the source object from which the values will be taken
 * @param destObjConfig `{ [key: string]: string }`
 * - an object representing the keys the new object will have along with the paths to the values in the source object.
 * - Both the keys and values of this config object can be `.` delimited paths
 * - Note optional chaining is not needed and will not work. If the property doesn't exist on the source object
 * it will be given the value `undefined`
 * @returns `D` an object that has the properties and values with the shape given by `D`
 */
export function generalObjectMapper<T, D>(
  sourceObj: T,
  destObjConfig: { [key: string]: string }
): D {
  const newObj = {};
  Object.keys(destObjConfig).forEach(key => {
    set(newObj, key, get(sourceObj, destObjConfig[key]));
  });
  return newObj as D;
}
