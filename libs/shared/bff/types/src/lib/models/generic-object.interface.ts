/**
 * this can be used in place of adding the inline type of `{ [key: string]: string }`
 */
export interface IGenericStringObject extends GenericObject<string, string> {
  [key: string]: string;
}

/**
 * a simple type utility that can be used for generic objects
 * where all keys `K` will be of the same type `string | number | symbol`,
 * and all values `V` will be of the same given type
 */
export type GenericObject<K extends string | number | symbol, V> = {
  [key in K]: V;
};
