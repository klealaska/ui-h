import { IPayment } from '@ui-coe/pay/shared/types';

export const mockPaymentList: IPayment[] = [
  {
    id: 'TRE00001',
    amount: 3000,
    date: new Date('2022-08-18T19:19:36.971Z'),
    vendor: 'AB Plumbing LLC',
    status: 'Status Example',
  },
  {
    id: 'TRE00002',
    amount: 4000,
    vendor: 'BC Electrical LLC',
    date: new Date('2022-08-19T19:19:36.971Z'),
    status: 'Status Example',
  },
  {
    id: 'TRE00003',
    amount: 5000,
    date: new Date('2022-08-20T19:19:36.971Z'),
    vendor: 'DE Heating LLC',
    status: 'Status Example',
  },
  {
    id: 'TRE00004',
    amount: 6000,
    date: new Date('2022-08-21T19:19:36.971Z'),
    vendor: 'FG Roofing LLC',
    status: 'Status Example',
  },
];
