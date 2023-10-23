export interface IData {
  position: number;
  weight: string | number;
  name: string;
  action: string;
  country: string;
}
export const data: Array<IData> = Array.from({ length: 100 }, (x, i) => ({
  name: 'Label' + i,
  position: i,
  weight: 'weight' + i,
  action: 'action' + i,
  country: 'country' + i,
}));
