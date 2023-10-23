export interface MockData {
  data: any;
}
export interface IAPIMockData {
  getAll?: MockData;
  post?: MockData;
  patch?: MockData;
  put?: MockData;
  getById?: MockData;
}
