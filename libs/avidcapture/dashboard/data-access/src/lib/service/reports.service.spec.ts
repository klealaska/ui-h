import { TestBed } from '@angular/core/testing';
import { DateTime } from 'luxon';
import * as fs from 'file-saver';

import { ReportsService } from './reports.service';

const headersStubAbs = [
  'Organization Name',
  'Organization ID',
  'Invoices To Be Worked',
  'Docs In Pending',
  'Docs In Exception',
  'Sub6Hours',
  '7to12Hours',
  '13to18Hours',
  '19to24Hours',
  '24Hours',
];

const dataStubAbs: any = [['avidxchange, inc', '25', 4, 2, 2, 0, 0, 0, 0, 4]];

describe('ReportsService', () => {
  let service: ReportsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReportsService);
    jest.spyOn(service['workBook'], 'addWorksheet').mockReturnValue({
      addRow: jest.fn(
        () =>
          ({
            height: '',
            font: {} as any,
            eachCell: jest.fn(),
          } as any)
      ),
      getCell: jest.fn(() => ({
        color: {} as any,
        size: '',
        bold: true,
      })),
      mergeCells: jest.fn(),
      getRow: jest.fn(
        () =>
          ({
            height: '',
            font: {} as any,
            eachCell: jest.fn(cb =>
              cb([
                {
                  fill: {},
                  border: {},
                  alignment: {},
                },
              ])
            ),
            apply: jest.fn,
          } as any)
      ),
      columns: [
        {
          values: ['mock', 'test'],
          width: '',
        },
      ],
    } as any);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('generateTransactionCountByEntityReport()', () => {
    const headersStub = [
      'Customer Name',
      'Date Received',
      'Entity Name',
      'Entity Code',
      'Electronic Invoice Count',
      'Paper Invoice Count',
      'Total',
    ];

    const dataStub = [
      [
        ['', '1642452683', '', '', '', '', '2'],
        ['', '1642452683', '', '', '', '', '6'],
      ],
    ];

    beforeEach(() => {
      jest.spyOn(service as any, 'exportReport').mockImplementation();
      jest.spyOn(service as any, 'addHeaderRow');
      jest.spyOn(service as any, 'addCustomerRow');
      jest.spyOn(service as any, 'addTransactionByEntityDataRows');
      jest.spyOn(service['workBook'] as any, 'removeWorksheet');

      service.generateTransactionCountByEntityReport(
        headersStub,
        dataStub,
        'AvidCapture Transaction Count By Entity',
        ['mock Buyer Name', '', '', '', '', '', ''],
        ['2/1/2022', '2/28/2022']
      );
    });

    it('should add a worksheet to the work book', () =>
      expect(service['workBook'].addWorksheet).toHaveBeenNthCalledWith(
        1,
        'AvidCapture Transaction Count By Entity',
        {
          views: [{ showGridLines: false }],
        }
      ));

    it('should add rows to the workSheet', () => {
      expect(service['workSheet'].addRow).toHaveBeenCalledTimes(11);

      expect(service['workSheet'].addRow).toHaveBeenNthCalledWith(1, []);

      expect(service['workSheet'].addRow).toHaveBeenNthCalledWith(2, [
        '*Report contains invoice counts from 2/1/2022 12:00 AM through 2/28/2022 11:59 PM',
      ]);

      expect(service['workSheet'].addRow).toHaveBeenNthCalledWith(3, []);

      expect(service['workSheet'].addRow).toHaveBeenNthCalledWith(4, [
        'Customer Name',
        'Date Received',
        'Entity Name',
        'Entity Code',
        'Electronic Invoice Count',
        'Paper Invoice Count',
        'Total',
      ]);

      expect(service['workSheet'].addRow).toHaveBeenNthCalledWith(5, [
        'mock Buyer Name',
        '',
        '',
        '',
        '',
        '',
        '',
      ]);

      expect(service['workSheet'].addRow).toHaveBeenNthCalledWith(6, [
        '-',
        '1642452683',
        '',
        '',
        '',
        '',
        '',
      ]);

      expect(service['workSheet'].addRow).toHaveBeenNthCalledWith(7, [
        '',
        '1642452683',
        '',
        '',
        '',
        '',
        '2',
      ]);

      expect(service['workSheet'].addRow).toHaveBeenNthCalledWith(8, [
        '',
        '1642452683',
        '',
        '',
        '',
        '',
        '6',
      ]);

      expect(service['workSheet'].addRow).toHaveBeenNthCalledWith(9, [
        'mock Buyer Name',
        '',
        '',
        '',
        '',
        '',
        '',
      ]);

      expect(service['workSheet'].addRow).toHaveBeenNthCalledWith(10, []);

      expect(service['workSheet'].addRow).toHaveBeenNthCalledWith(11, [
        `Execution time: ${DateTime.local().toFormat('dd MMM y h:mma ZZZZ')}`,
      ]);
    });

    it('should call addHeaderRow passing headers param', () =>
      expect(service['addHeaderRow']).toHaveBeenNthCalledWith(1, headersStub));

    it('should call addCustomerRow passing customerRow param', () =>
      expect(service['addCustomerRow']).toHaveBeenNthCalledWith(1, [
        'mock Buyer Name',
        '',
        '',
        '',
        '',
        '',
        '',
      ]));

    it('should call addTransactionByEntityDataRows passing data param', () =>
      expect(service['addTransactionByEntityDataRows']).toHaveBeenNthCalledWith(1, dataStub));

    it('should call addCustomerRow passing customerRow param', () =>
      expect(service['addCustomerRow']).toHaveBeenNthCalledWith(2, [
        'mock Buyer Name',
        '',
        '',
        '',
        '',
        '',
        '',
      ]));

    it('should remove the workSheet from the workBook after generating report', () =>
      expect(service['workBook'].removeWorksheet).toHaveBeenNthCalledWith(
        1,
        service['workSheet'].id
      ));
  });

  describe('private exportReport()', () => {
    beforeEach(() => {
      jest.spyOn(fs, 'saveAs').mockImplementation();
      jest.spyOn(service['workBook'].xlsx, 'writeBuffer').mockResolvedValue(new Uint8Array());
      service['exportReport']('EDW - Invoice Image');
    });

    it('should call fs saveAs function', () => expect(fs.saveAs).toHaveBeenCalledTimes(1));
  });

  describe('addHeaderRow()', () => {
    beforeEach(() => {
      service['workSheet'] = {
        addRow: jest.fn(
          () =>
            ({
              height: '',
              font: {} as any,
              eachCell: jest.fn(cb =>
                cb([
                  {
                    fill: {},
                    border: {},
                    alignment: {},
                  },
                ])
              ),
            } as any)
        ),
      } as any;

      service['addHeaderRow'](headersStubAbs);
    });

    it('should add a new row to the worksheet using headers param', () =>
      expect(service['workSheet'].addRow).toHaveBeenNthCalledWith(1, headersStubAbs));
  });

  describe('addCustomerRow()', () => {
    beforeEach(() => {
      service['workSheet'] = {
        addRow: jest.fn(
          () =>
            ({
              font: {} as any,
              eachCell: jest.fn(cb =>
                cb([
                  {
                    fill: {},
                    border: {},
                    alignment: {},
                  },
                ])
              ),
            } as any)
        ),
      } as any;

      service['addCustomerRow'](['mock', '', '', '', '', '', '']);
    });

    it('should add a new row to the worksheet using customerName param', () =>
      expect(service['workSheet'].addRow).toHaveBeenNthCalledWith(1, [
        'mock',
        '',
        '',
        '',
        '',
        '',
        '',
      ]));
  });

  describe('addTransactionByEntityDataRows()', () => {
    const dataStub = [
      [
        ['', '1642452683', '', '', '', '', '2'],
        ['', '1642452683', '', '', '', '', '6'],
      ],
    ];

    beforeEach(() => {
      jest.spyOn(service as any, 'addMonthRow').mockImplementation();
      service['workSheet'] = {
        addRow: jest.fn(
          () =>
            ({
              font: {} as any,
              eachCell: jest.fn(cb =>
                cb([
                  {
                    fill: {},
                    border: {},
                    alignment: {},
                  },
                ])
              ),
            } as any)
        ),
      } as any;

      service['addTransactionByEntityDataRows'](dataStub);
    });

    it('should call addMonthRow', () =>
      expect(service['addMonthRow']).toHaveBeenNthCalledWith(1, [
        '',
        '1642452683',
        '',
        '',
        '',
        '',
        '2',
      ]));

    it('should add a new row per each data object to the worksheet using data param', () => {
      expect(service['workSheet'].addRow).toHaveBeenNthCalledWith(1, [
        '',
        '1642452683',
        '',
        '',
        '',
        '',
        '2',
      ]);

      expect(service['workSheet'].addRow).toHaveBeenNthCalledWith(2, [
        '',
        '1642452683',
        '',
        '',
        '',
        '',
        '6',
      ]);
    });
  });

  describe('addMonthRow()', () => {
    beforeEach(() => {
      service['workSheet'] = {
        addRow: jest.fn(
          () =>
            ({
              font: {} as any,
              eachCell: jest.fn(cb =>
                cb([
                  {
                    fill: {},
                    border: {},
                    alignment: {},
                  },
                ])
              ),
            } as any)
        ),
      } as any;

      service['addMonthRow'](['', '2022/05']);
    });

    it('should add a new month row to the worksheet using param', () => {
      expect(service['workSheet'].addRow).toHaveBeenNthCalledWith(1, [
        '-',
        '2022/05',
        '',
        '',
        '',
        '',
        '',
      ]);
    });
  });
});
