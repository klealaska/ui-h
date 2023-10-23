/* eslint-disable */
import { CompositeDocument, SearchContext } from '@ui-coe/avidcapture/shared/types';

export const CompositeData100008306: CompositeDocument = {
  indexed: {
    indexer: 'IDC',
    lastModified: '2020-09-01T18:48:52.037Z',
    labels: [
      {
        id: '1',
        label: 'ServiceBusMessage',
        page: 0,
        value: {
          text: '{"BuyerId":"2215789","FileId":"188758761","FileName":"B12684109.pdf","CorrelationId":"e9b7290d-dba3-4cb3-95e3-0fa2ce1009d4","InvoiceSourceId":"AvidSuite","IngestionType":"email","SourceEmail":"InvoiceAcknowledgements@shi.com","id":"00000000-0000-0000-0000-000000000000"}',
          confidence: 0,
          boundingBox: [],
          required: false,
          incomplete: false,
          incompleteReason: null,
          type: 'IdcServiceBusMessage',
          verificationState: 'NotRequired',
        },
      },
      {
        id: '1',
        label: 'BuyerName',
        page: 0,
        value: {
          text: 'Finance of America Holdings',
          confidence: 0,
          boundingBox: [],
          required: false,
          incomplete: false,
          incompleteReason: null,
          type: 'string',
          verificationState: 'NotRequired',
        },
      },
      {
        id: '1',
        label: 'BuyerId',
        page: 0,
        value: {
          text: '2215789',
          confidence: 0,
          boundingBox: [],
          required: false,
          incomplete: false,
          incompleteReason: null,
          type: 'string',
          verificationState: 'NotRequired',
        },
      },
      {
        id: '1',
        label: 'SourceSystem',
        page: 0,
        value: {
          text: SearchContext.AvidSuite,
          confidence: 0,
          boundingBox: [],
          required: false,
          incomplete: false,
          incompleteReason: null,
          type: 'string',
          verificationState: 'NotRequired',
        },
      },
      {
        id: '1',
        label: 'IngestionType',
        page: 0,
        value: {
          text: 'email',
          confidence: 0,
          boundingBox: [],
          required: false,
          incomplete: false,
          incompleteReason: null,
          type: 'string',
          verificationState: 'NotRequired',
        },
      },
      {
        id: '1',
        label: 'BuyerKeyword',
        page: 0,
        value: {
          text: 'fahap',
          confidence: 0,
          boundingBox: [],
          required: false,
          incomplete: false,
          incompleteReason: null,
          type: 'string',
          verificationState: 'NotRequired',
        },
      },
      {
        id: '1',
        label: 'BillingAddress',
        page: 2,
        value: {
          text: '300 Welsh Road building 5 Horsham, PA 19044 USA',
          confidence: 0.93,
          boundingBox: [1.0682, 2.5428, 2.1819, 2.5428, 2.1819, 3.0785, 1.0682, 3.0785],
          required: false,
          incomplete: false,
          incompleteReason: null,
          type: 'string',
          verificationState: 'NotRequired',
        },
      },
      {
        id: '1',
        label: 'BillingAddressRecipient',
        page: 2,
        value: {
          text: 'Finance of America Holdings LLC',
          confidence: 0.997,
          boundingBox: [1.0732, 2.3936, 2.919, 2.3936, 2.919, 2.5107, 1.0732, 2.5107],
          required: false,
          incomplete: false,
          incompleteReason: null,
          type: 'string',
          verificationState: 'NotRequired',
        },
      },
      {
        id: '1',
        label: 'CustomerName',
        page: 2,
        value: {
          text: 'Finance of America Holdings LLC',
          confidence: 0.997,
          boundingBox: [1.0732, 2.3936, 2.919, 2.3936, 2.919, 2.5107, 1.0732, 2.5107],
          required: false,
          incomplete: false,
          incompleteReason: null,
          type: 'string',
          verificationState: 'NotRequired',
        },
      },
      {
        id: '1',
        label: 'InvoiceDate',
        page: 1,
        value: {
          text: '12/03/2020',
          confidence: 1,
          boundingBox: [6.4309, 0.3334, 6.9671, 0.3334, 6.9671, 0.4259, 6.4309, 0.4259],
          required: true,
          incomplete: true,
          incompleteReason: 'Required but not found by IDC',
          type: 'date',
          verificationState: 'NotRequired',
        },
      },
      {
        id: '1',
        label: 'InvoiceId',
        page: 1,
        value: {
          text: 'B12684109',
          confidence: 1,
          boundingBox: [6.431, 0.1249, 7.3447, 0.1249, 7.3447, 0.2578, 6.431, 0.2578],
          required: false,
          incomplete: false,
          incompleteReason: null,
          type: 'string',
          verificationState: 'NotRequired',
        },
      },
      {
        id: '1',
        label: 'InvoiceTotal',
        page: 2,
        value: {
          text: '8,565.33',
          confidence: 0.936,
          boundingBox: [7.063, 9.2747, 7.5402, 9.2747, 7.5402, 9.3853, 7.063, 9.3853],
          required: false,
          incomplete: false,
          incompleteReason: null,
          type: 'number',
          verificationState: 'NotRequired',
        },
      },
      {
        id: '1',
        label: 'PurchaseOrder',
        page: 1,
        value: {
          text: 'FAH-20201130-96112-4',
          confidence: 0.977,
          boundingBox: [2.774, 3.5789, 4.1053, 3.5789, 4.1053, 3.6703, 2.774, 3.6703],
          required: false,
          incomplete: false,
          incompleteReason: null,
          type: 'string',
          verificationState: 'NotRequired',
        },
      },
      {
        id: '1',
        label: 'RemittanceAddress',
        page: 1,
        value: {
          text: 'P.O. Box 952121 Dallas, TX 75395-2121',
          confidence: 0.998,
          boundingBox: [2.6857, 0.3818, 3.7926, 0.3818, 3.7926, 0.6101, 2.6857, 0.6101],
          required: false,
          incomplete: false,
          incompleteReason: null,
          type: 'string',
          verificationState: 'NotRequired',
        },
      },
      {
        id: '1',
        label: 'RemittanceAddressRecipient',
        page: 1,
        value: {
          text: 'SHI International Corp',
          confidence: 0.996,
          boundingBox: [2.6822, 0.2502, 3.7712, 0.2502, 3.7712, 0.3531, 2.6822, 0.3531],
          required: false,
          incomplete: false,
          incompleteReason: null,
          type: 'string',
          verificationState: 'NotRequired',
        },
      },
      {
        id: '1',
        label: 'ShippingAddress',
        page: 1,
        value: {
          text: '300 Welsh Road Building 4, Suite 200 Horsham, PA 19044 USA',
          confidence: 0.899,
          boundingBox: [4.769, 2.5428, 5.9034, 2.5428, 5.9034, 3.0785, 4.769, 3.0785],
          required: false,
          incomplete: false,
          incompleteReason: null,
          type: 'string',
          verificationState: 'NotRequired',
        },
      },
      {
        id: '1',
        label: 'ShippingAddressRecipient',
        page: 1,
        value: {
          text: 'Finance of America',
          confidence: 0.993,
          boundingBox: [4.774, 2.3936, 5.8347, 2.3936, 5.8347, 2.4859, 4.774, 2.4859],
          required: false,
          incomplete: false,
          incompleteReason: null,
          type: 'string',
          verificationState: 'NotRequired',
        },
      },
      {
        id: '1',
        label: 'SubTotal',
        page: 2,
        value: {
          text: '8,080.50',
          confidence: 0.546,
          boundingBox: [7.0641, 8.4872, 7.5392, 8.4872, 7.5392, 8.5947, 7.0641, 8.5947],
          required: false,
          incomplete: false,
          incompleteReason: null,
          type: 'number',
          verificationState: 'NotRequired',
        },
      },
      {
        id: '1',
        label: 'TotalTax',
        page: 2,
        value: {
          text: '484.83',
          confidence: 0.999,
          boundingBox: [7.1555, 9.0777, 7.5304, 9.0777, 7.5304, 9.1691, 7.1555, 9.1691],
          required: false,
          incomplete: false,
          incompleteReason: null,
          type: 'number',
          verificationState: 'NotRequired',
        },
      },
      {
        id: '1',
        label: 'VendorAddress',
        page: 1,
        value: {
          text: '290 Davidson Ave. Somerset, NJ 08873',
          confidence: 0.988,
          boundingBox: [0.2001, 1.0386, 1.2041, 1.0386, 1.2041, 1.2658, 0.2001, 1.2658],
          required: false,
          incomplete: false,
          incompleteReason: null,
          type: 'string',
          verificationState: 'NotRequired',
        },
      },
      {
        id: '1',
        label: 'VendorAddressRecipient',
        page: 1,
        value: {
          text: 'Federal tax ID: 22-3009648',
          confidence: 0.725,
          boundingBox: [0.206, 0.9069, 1.5437, 0.9069, 1.5437, 0.9881, 0.206, 0.9881],
          required: false,
          incomplete: false,
          incompleteReason: null,
          type: 'string',
          verificationState: 'NotRequired',
        },
      },
      {
        id: '1',
        label: 'VendorName',
        page: 1,
        value: {
          text: 'shi',
          confidence: 0.999,
          boundingBox: [0.2494, 0.1769, 1.3693, 0.1497, 1.3874, 0.7483, 0.263, 0.78],
          required: false,
          incomplete: false,
          incompleteReason: null,
          type: 'string',
          verificationState: 'NotRequired',
        },
      },
      {
        id: '1',
        label: 'CustomerAccountNumber',
        page: 1,
        value: {
          text: 'S52873863',
          confidence: 1,
          boundingBox: [6.4229, 0.6297, 7.0509, 0.6297, 7.0509, 0.7222, 6.4229, 0.7222],
          required: true,
          incomplete: true,
          incompleteReason: 'Required but not found by IDC',
          type: 'string',
          verificationState: 'NotRequired',
        },
      },
      {
        id: '1',
        label: 'InvoiceNumber',
        page: 1,
        value: {
          text: 'B12684109',
          confidence: 1,
          boundingBox: [6.431, 0.1249, 7.3447, 0.1249, 7.3447, 0.2578, 6.431, 0.2578],
          required: true,
          incomplete: true,
          incompleteReason: 'Required but not found by IDC',
          type: 'string',
          verificationState: 'NotRequired',
        },
      },
      {
        id: '1',
        label: 'Total',
        page: 2,
        value: {
          text: '8565.33',
          confidence: 1,
          boundingBox: [7.063, 9.2747, 7.5402, 9.2747, 7.5402, 9.3853, 7.063, 9.3853],
          required: true,
          incomplete: false,
          incompleteReason: null,
          type: 'number',
          verificationState: 'NotRequired',
        },
      },
      {
        id: '1',
        label: 'PurchaseOrderIdentifier',
        page: 1,
        value: {
          text: 'FAH-20201130-96112-4',
          confidence: 0.977,
          boundingBox: [2.774, 3.5789, 4.1053, 3.5789, 4.1053, 3.6703, 2.774, 3.6703],
          required: false,
          incomplete: false,
          incompleteReason: null,
          type: 'string',
          verificationState: 'NotRequired',
        },
      },
      {
        id: '1',
        label: 'InvoiceType',
        page: 0,
        value: {
          text: 'Standard',
          confidence: 1,
          boundingBox: [],
          required: true,
          incomplete: true,
          incompleteReason: 'Required but not found by IDC',
          type: null,
          verificationState: 'NotRequired',
        },
      },
      {
        id: '1',
        label: 'Supplier',
        page: 1,
        value: {
          text: 'SHI International Corp',
          confidence: 1,
          boundingBox: [2.6822, 0.2502, 3.7712, 0.2502, 3.7712, 0.3531, 2.6822, 0.3531],
          required: true,
          incomplete: true,
          incompleteReason: 'Required but not found by IDC',
          type: null,
          verificationState: 'NotRequired',
        },
      },
      {
        id: '1',
        label: 'SupplierId',
        page: 0,
        value: {
          text: '',
          confidence: 0,
          boundingBox: [],
          required: true,
          incomplete: true,
          incompleteReason: 'Required but not found by IDC',
          type: null,
          verificationState: 'NotRequired',
        },
      },
      {
        id: '1',
        label: 'ShipToName',
        page: 1,
        value: {
          text: 'Finance of America Holdings LLC',
          confidence: 1,
          boundingBox: [1.0732, 2.3936, 2.919, 2.3936, 2.919, 2.5107, 1.0732, 2.5107],
          required: true,
          incomplete: true,
          incompleteReason: 'Required but not found by IDC',
          type: null,
          verificationState: 'NotRequired',
        },
      },
      {
        id: '1',
        label: 'ShipToID',
        page: 0,
        value: {
          text: '',
          confidence: 0,
          boundingBox: [],
          required: true,
          incomplete: true,
          incompleteReason: 'Required but not found by IDC',
          type: null,
          verificationState: 'NotRequired',
        },
      },
      {
        id: '1',
        label: 'ShipToAddress',
        page: 1,
        value: {
          text: '300 Welsh Road Building 4, Suite 200 Horsham, PA 19044 USA',
          confidence: 1,
          boundingBox: [4.769, 2.5428, 5.9034, 2.5428, 5.9034, 3.0785, 4.769, 3.0785],
          required: true,
          incomplete: true,
          incompleteReason: 'Required but not found by IDC',
          type: null,
          verificationState: 'NotRequired',
        },
      },
      {
        id: '1',
        label: 'CurrentCharges',
        page: 0,
        value: {
          text: '',
          confidence: 0,
          boundingBox: [],
          required: true,
          incomplete: true,
          incompleteReason: 'Required but not found by IDC',
          type: null,
          verificationState: 'NotRequired',
        },
      },
      {
        id: '1',
        label: 'SupplierAddress',
        page: 1,
        value: {
          text: 'P.O. Box 952121 Dallas, TX 75395-2121',
          confidence: 1,
          boundingBox: [2.6857, 0.3818, 3.7926, 0.3818, 3.7926, 0.6101, 2.6857, 0.6101],
          required: false,
          incomplete: false,
          incompleteReason: null,
          type: null,
          verificationState: 'NotRequired',
        },
      },
      {
        id: '1',
        label: 'InvoiceDueDate',
        page: 1,
        value: {
          text: '12/03/2020',
          confidence: 1,
          boundingBox: [0.3576, 3.5778, 0.8937, 3.5778, 0.8937, 3.6703, 0.3576, 3.6703],
          required: false,
          incomplete: false,
          incompleteReason: null,
          type: null,
          verificationState: 'NotRequired',
        },
      },
    ],
    activities: [],
    documentId: 'B9D37260-FB5D-498C-B582-AD9F02CFCCE8',
    fileId: '100008306.pdf',
    dateReceived: '2020-09-01T18:48:52.037Z',
  },
  unindexed: {
    indexer: 'avidtest@avidxchange.com',
    pages: [
      {
        number: 1,
        lines: [
          {
            number: 0,
            words: [
              {
                boundingBox: [0.2494, 0.1769, 1.3693, 0.1497, 1.3874, 0.7483, 0.263, 0.78],
                label: 'ocr text',
                value: 'shi',
                confidence: 0.981,
              },
            ],
          },
          {
            number: 1,
            words: [
              {
                boundingBox: [2.6857, 0.1198, 3.0122, 0.1198, 3.0122, 0.2006, 2.6857, 0.2006],
                label: 'ocr text',
                value: 'Please',
                confidence: 1,
              },
              {
                boundingBox: [3.0547, 0.1198, 3.2936, 0.1198, 3.2936, 0.2006, 3.0547, 0.2006],
                label: 'ocr text',
                value: 'remit',
                confidence: 1,
              },
              {
                boundingBox: [3.3324, 0.1216, 3.7504, 0.1216, 3.7504, 0.2226, 3.3324, 0.2226],
                label: 'ocr text',
                value: 'payment',
                confidence: 1,
              },
              {
                boundingBox: [3.7838, 0.1216, 3.8955, 0.1216, 3.8955, 0.2006, 3.7838, 0.2006],
                label: 'ocr text',
                value: 'to:',
                confidence: 1,
              },
            ],
          },
          {
            number: 2,
            words: [
              {
                boundingBox: [5.0509, 0.1236, 5.6558, 0.1236, 5.6558, 0.2569, 5.0509, 0.2569],
                label: 'ocr text',
                value: 'Invoice',
                confidence: 1,
              },
              {
                boundingBox: [5.7233, 0.1249, 5.99, 0.1249, 5.99, 0.2569, 5.7233, 0.2569],
                label: 'ocr text',
                value: 'No.',
                confidence: 1,
              },
            ],
          },
          {
            number: 3,
            words: [
              {
                boundingBox: [6.431, 0.1249, 7.3447, 0.1249, 7.3447, 0.2578, 6.431, 0.2578],
                label: 'ocr text',
                value: 'B12684109',
                confidence: 1,
              },
            ],
          },
          {
            number: 4,
            words: [
              {
                boundingBox: [2.6822, 0.2502, 2.8523, 0.2502, 2.8523, 0.3323, 2.6822, 0.3323],
                label: 'ocr text',
                value: 'SHI',
                confidence: 1,
              },
              {
                boundingBox: [2.9033, 0.2515, 3.4963, 0.2515, 3.4963, 0.3323, 2.9033, 0.3323],
                label: 'ocr text',
                value: 'International',
                confidence: 1,
              },
              {
                boundingBox: [3.5404, 0.2502, 3.7712, 0.2502, 3.7712, 0.3531, 3.5404, 0.3531],
                label: 'ocr text',
                value: 'Corp',
                confidence: 1,
              },
            ],
          },
          {
            number: 5,
            words: [
              {
                boundingBox: [2.6857, 0.3818, 2.8895, 0.3818, 2.8895, 0.464, 2.6857, 0.464],
                label: 'ocr text',
                value: 'P.O.',
                confidence: 1,
              },
              {
                boundingBox: [2.9379, 0.3832, 3.1204, 0.3832, 3.1204, 0.464, 2.9379, 0.464],
                label: 'ocr text',
                value: 'Box',
                confidence: 1,
              },
              {
                boundingBox: [3.1566, 0.3829, 3.5023, 0.3829, 3.5023, 0.464, 3.1566, 0.464],
                label: 'ocr text',
                value: '952121',
                confidence: 1,
              },
            ],
          },
          {
            number: 6,
            words: [
              {
                boundingBox: [5.051, 0.3349, 5.4301, 0.3349, 5.4301, 0.4258, 5.051, 0.4258],
                label: 'ocr text',
                value: 'Invoice',
                confidence: 1,
              },
              {
                boundingBox: [5.4741, 0.3349, 5.7079, 0.3349, 5.7079, 0.4258, 5.4741, 0.4258],
                label: 'ocr text',
                value: 'date',
                confidence: 1,
              },
            ],
          },
          {
            number: 7,
            words: [
              {
                boundingBox: [6.4309, 0.3334, 6.9671, 0.3334, 6.9671, 0.4259, 6.4309, 0.4259],
                label: 'ocr text',
                value: '12/3/2020',
                confidence: 1,
              },
            ],
          },
          {
            number: 8,
            words: [
              {
                boundingBox: [2.6857, 0.5149, 3.0068, 0.5149, 3.0068, 0.6101, 2.6857, 0.6101],
                label: 'ocr text',
                value: 'Dallas,',
                confidence: 1,
              },
              {
                boundingBox: [3.0499, 0.5149, 3.1886, 0.5149, 3.1886, 0.5945, 3.0499, 0.5945],
                label: 'ocr text',
                value: 'TX',
                confidence: 1,
              },
              {
                boundingBox: [3.2252, 0.5146, 3.7926, 0.5146, 3.7926, 0.5958, 3.2252, 0.5958],
                label: 'ocr text',
                value: '75395-2121',
                confidence: 1,
              },
            ],
          },
          {
            number: 9,
            words: [
              {
                boundingBox: [5.0456, 0.4816, 5.5827, 0.4816, 5.5827, 0.574, 5.0456, 0.574],
                label: 'ocr text',
                value: 'Customer',
                confidence: 1,
              },
              {
                boundingBox: [5.6239, 0.4831, 6.0411, 0.4831, 6.0411, 0.574, 5.6239, 0.574],
                label: 'ocr text',
                value: 'number',
                confidence: 1,
              },
            ],
          },
          {
            number: 10,
            words: [
              {
                boundingBox: [6.4309, 0.4827, 6.8981, 0.4827, 6.8981, 0.574, 6.4309, 0.574],
                label: 'ocr text',
                value: '1081046',
                confidence: 1,
              },
            ],
          },
          {
            number: 11,
            words: [
              {
                boundingBox: [2.6785, 0.6466, 2.9008, 0.6466, 2.9008, 0.7274, 2.6785, 0.7274],
                label: 'ocr text',
                value: 'Wire',
                confidence: 1,
              },
              {
                boundingBox: [2.9435, 0.6453, 3.5066, 0.6453, 3.5066, 0.7274, 2.9435, 0.7274],
                label: 'ocr text',
                value: 'information:',
                confidence: 1,
              },
              {
                boundingBox: [3.5484, 0.6466, 3.8142, 0.6466, 3.8142, 0.7274, 3.5484, 0.7274],
                label: 'ocr text',
                value: 'Wells',
                confidence: 1,
              },
              {
                boundingBox: [3.8584, 0.6466, 4.1353, 0.6466, 4.1353, 0.7494, 3.8584, 0.7494],
                label: 'ocr text',
                value: 'Fargo',
                confidence: 1,
              },
              {
                boundingBox: [4.1783, 0.6466, 4.4228, 0.6466, 4.4228, 0.7274, 4.1783, 0.7274],
                label: 'ocr text',
                value: 'Bank',
                confidence: 1,
              },
            ],
          },
          {
            number: 12,
            words: [
              {
                boundingBox: [5.045, 0.6297, 5.347, 0.6297, 5.347, 0.7221, 5.045, 0.7221],
                label: 'ocr text',
                value: 'Sales',
                confidence: 1,
              },
              {
                boundingBox: [5.3906, 0.6312, 5.68, 0.6312, 5.68, 0.7221, 5.3906, 0.7221],
                label: 'ocr text',
                value: 'order',
                confidence: 1,
              },
            ],
          },
          {
            number: 13,
            words: [
              {
                boundingBox: [6.4229, 0.6297, 7.0509, 0.6297, 7.0509, 0.7222, 6.4229, 0.7222],
                label: 'ocr text',
                value: 'S52873863',
                confidence: 1,
              },
            ],
          },
          {
            number: 14,
            words: [
              {
                boundingBox: [2.6785, 0.7783, 2.9008, 0.7783, 2.9008, 0.8591, 2.6785, 0.8591],
                label: 'ocr text',
                value: 'Wire',
                confidence: 1,
              },
              {
                boundingBox: [2.9449, 0.777, 3.1075, 0.777, 3.1075, 0.8591, 2.9449, 0.8591],
                label: 'ocr text',
                value: 'Rt#',
                confidence: 1,
              },
              {
                boundingBox: [3.1518, 0.778, 3.6908, 0.778, 3.6908, 0.8591, 3.1518, 0.8591],
                label: 'ocr text',
                value: '121000248',
                confidence: 1,
              },
            ],
          },
          {
            number: 15,
            words: [
              {
                boundingBox: [0.206, 0.9072, 0.5656, 0.9072, 0.5656, 0.988, 0.206, 0.988],
                label: 'ocr text',
                value: 'Federal',
                confidence: 1,
              },
              {
                boundingBox: [0.6062, 0.909, 0.7515, 0.909, 0.7515, 0.988, 0.6062, 0.988],
                label: 'ocr text',
                value: 'tax',
                confidence: 1,
              },
              {
                boundingBox: [0.7934, 0.9072, 0.9152, 0.9072, 0.9152, 0.9868, 0.7934, 0.9868],
                label: 'ocr text',
                value: 'ID:',
                confidence: 1,
              },
              {
                boundingBox: [0.9589, 0.9069, 1.5437, 0.9069, 1.5437, 0.9881, 0.9589, 0.9881],
                label: 'ocr text',
                value: '22-3009648',
                confidence: 1,
              },
            ],
          },
          {
            number: 16,
            words: [
              {
                boundingBox: [2.6772, 0.9087, 2.9027, 0.9087, 2.9027, 0.9908, 2.6772, 0.9908],
                label: 'ocr text',
                value: 'ACH',
                confidence: 1,
              },
              {
                boundingBox: [2.9512, 0.9087, 3.1137, 0.9087, 3.1137, 0.9908, 2.9512, 0.9908],
                label: 'ocr text',
                value: 'Rt#',
                confidence: 1,
              },
              {
                boundingBox: [3.1506, 0.9097, 3.6975, 0.9097, 3.6975, 0.9908, 3.1506, 0.9908],
                label: 'ocr text',
                value: '021200025',
                confidence: 1,
              },
            ],
          },
          {
            number: 17,
            words: [
              {
                boundingBox: [5.0091, 0.857, 5.3906, 0.857, 5.3906, 0.9378, 5.0091, 0.9378],
                label: 'ocr text',
                value: 'Finance',
                confidence: 1,
              },
              {
                boundingBox: [5.4302, 0.857, 5.761, 0.857, 5.761, 0.9598, 5.4302, 0.9598],
                label: 'ocr text',
                value: 'charge',
                confidence: 1,
              },
              {
                boundingBox: [5.8, 0.8557, 5.8929, 0.8557, 5.8929, 0.9378, 5.8, 0.9378],
                label: 'ocr text',
                value: 'of',
                confidence: 1,
              },
              {
                boundingBox: [5.9318, 0.8557, 6.166, 0.8557, 6.166, 0.9394, 5.9318, 0.9394],
                label: 'ocr text',
                value: '1.5%',
                confidence: 1,
              },
              {
                boundingBox: [6.2109, 0.8777, 6.3657, 0.8777, 6.3657, 0.9586, 6.2109, 0.9586],
                label: 'ocr text',
                value: 'per',
                confidence: 1,
              },
              {
                boundingBox: [6.4022, 0.857, 6.696, 0.857, 6.696, 0.9378, 6.4022, 0.9378],
                label: 'ocr text',
                value: 'month',
                confidence: 1,
              },
              {
                boundingBox: [6.7347, 0.857, 6.8808, 0.857, 6.8808, 0.9366, 6.7347, 0.9366],
                label: 'ocr text',
                value: 'will',
                confidence: 1,
              },
              {
                boundingBox: [6.9266, 0.857, 7.0383, 0.857, 7.0383, 0.9378, 6.9266, 0.9378],
                label: 'ocr text',
                value: 'be',
                confidence: 1,
              },
              {
                boundingBox: [7.078, 0.857, 7.4671, 0.857, 7.4671, 0.9598, 7.078, 0.9598],
                label: 'ocr text',
                value: 'charged',
                confidence: 1,
              },
              {
                boundingBox: [7.5096, 0.8777, 7.6218, 0.8777, 7.6218, 0.9378, 7.5096, 0.9378],
                label: 'ocr text',
                value: 'on',
                confidence: 1,
              },
            ],
          },
          {
            number: 18,
            words: [
              {
                boundingBox: [0.2001, 1.0386, 0.3769, 1.0386, 0.3769, 1.1197, 0.2001, 1.1197],
                label: 'ocr text',
                value: '290',
                confidence: 1,
              },
              {
                boundingBox: [0.4215, 1.0389, 0.8684, 1.0389, 0.8684, 1.1197, 0.4215, 1.1197],
                label: 'ocr text',
                value: 'Davidson',
                confidence: 1,
              },
              {
                boundingBox: [0.9069, 1.0389, 1.1194, 1.0389, 1.1194, 1.1197, 0.9069, 1.1197],
                label: 'ocr text',
                value: 'Ave.',
                confidence: 1,
              },
            ],
          },
          {
            number: 19,
            words: [
              {
                boundingBox: [2.6772, 1.0403, 3.9379, 1.0403, 3.9379, 1.1226, 2.6772, 1.1226],
                label: 'ocr text',
                value: 'Account#2000037641964',
                confidence: 1,
              },
            ],
          },
          {
            number: 20,
            words: [
              {
                boundingBox: [5.0073, 0.9905, 5.2092, 0.9905, 5.2092, 1.0903, 5.0073, 1.0903],
                label: 'ocr text',
                value: 'past',
                confidence: 1,
              },
              {
                boundingBox: [5.2444, 0.9887, 5.4214, 0.9887, 5.4214, 1.0695, 5.2444, 1.0695],
                label: 'ocr text',
                value: 'due',
                confidence: 1,
              },
              {
                boundingBox: [5.4608, 0.9905, 5.897, 0.9905, 5.897, 1.0695, 5.4608, 1.0695],
                label: 'ocr text',
                value: 'accounts',
                confidence: 1,
              },
              {
                boundingBox: [5.9357, 1.0346, 5.9657, 1.0346, 5.9657, 1.0444, 5.9357, 1.0444],
                label: 'ocr text',
                value: '-',
                confidence: 1,
              },
              {
                boundingBox: [6.012, 0.9874, 6.3668, 0.9874, 6.3668, 1.0915, 6.012, 1.0915],
                label: 'ocr text',
                value: '18%/yr.',
                confidence: 1,
              },
            ],
          },
          {
            number: 21,
            words: [
              {
                boundingBox: [0.2019, 1.1693, 0.6931, 1.1693, 0.6931, 1.2658, 0.2019, 1.2658],
                label: 'ocr text',
                value: 'Somerset,',
                confidence: 1,
              },
              {
                boundingBox: [0.7421, 1.1706, 0.8607, 1.1706, 0.8607, 1.2514, 0.7421, 1.2514],
                label: 'ocr text',
                value: 'NJ',
                confidence: 1,
              },
              {
                boundingBox: [0.9049, 1.1703, 1.2041, 1.1703, 1.2041, 1.2515, 0.9049, 1.2515],
                label: 'ocr text',
                value: '08873',
                confidence: 1,
              },
            ],
          },
          {
            number: 22,
            words: [
              {
                boundingBox: [2.6822, 1.172, 3.0202, 1.172, 3.0202, 1.2541, 2.6822, 1.2541],
                label: 'ocr text',
                value: 'SWIFT',
                confidence: 1,
              },
              {
                boundingBox: [3.0586, 1.172, 3.3397, 1.172, 3.3397, 1.2541, 3.0586, 1.2541],
                label: 'ocr text',
                value: 'Code:',
                confidence: 1,
              },
              {
                boundingBox: [3.3815, 1.172, 3.9418, 1.172, 3.9418, 1.2541, 3.3815, 1.2541],
                label: 'ocr text',
                value: 'WFBIUS6S',
                confidence: 1,
              },
            ],
          },
          {
            number: 23,
            words: [
              {
                boundingBox: [5, 1.1204, 5.1156, 1.1204, 5.1156, 1.2, 5, 1.2],
                label: 'ocr text',
                value: 'All',
                confidence: 1,
              },
              {
                boundingBox: [5.1613, 1.1222, 5.4954, 1.1222, 5.4954, 1.2012, 5.1613, 1.2012],
                label: 'ocr text',
                value: 'returns',
                confidence: 1,
              },
              {
                boundingBox: [5.5378, 1.1204, 5.8718, 1.1204, 5.8718, 1.222, 5.5378, 1.222],
                label: 'ocr text',
                value: 'require',
                confidence: 1,
              },
              {
                boundingBox: [5.9111, 1.1411, 6.023, 1.1411, 6.023, 1.2012, 5.9111, 1.2012],
                label: 'ocr text',
                value: 'an',
                confidence: 1,
              },
              {
                boundingBox: [6.0702, 1.1191, 6.3686, 1.1191, 6.3686, 1.2012, 6.0702, 1.2012],
                label: 'ocr text',
                value: 'RMA#',
                confidence: 1,
              },
              {
                boundingBox: [6.4042, 1.1204, 6.8066, 1.1204, 6.8066, 1.222, 6.4042, 1.222],
                label: 'ocr text',
                value: 'supplied',
                confidence: 1,
              },
              {
                boundingBox: [6.8526, 1.1204, 6.9617, 1.1204, 6.9617, 1.2232, 6.8526, 1.2232],
                label: 'ocr text',
                value: 'by',
                confidence: 1,
              },
              {
                boundingBox: [6.9952, 1.1411, 7.2111, 1.1411, 7.2111, 1.2232, 6.9952, 1.2232],
                label: 'ocr text',
                value: 'your',
                confidence: 1,
              },
              {
                boundingBox: [7.2453, 1.1191, 7.4154, 1.1191, 7.4154, 1.2012, 7.2453, 1.2012],
                label: 'ocr text',
                value: 'SHI',
                confidence: 1,
              },
            ],
          },
          {
            number: 24,
            words: [
              {
                boundingBox: [0.2054, 1.3023, 0.5391, 1.3023, 0.5391, 1.3831, 0.2054, 1.3831],
                label: 'ocr text',
                value: 'Phone:',
                confidence: 1,
              },
              {
                boundingBox: [0.5841, 1.302, 1.251, 1.302, 1.251, 1.3832, 0.5841, 1.3832],
                label: 'ocr text',
                value: '888-235-3871',
                confidence: 1,
              },
            ],
          },
          {
            number: 25,
            words: [
              {
                boundingBox: [2.6863, 1.3051, 2.8453, 1.3051, 2.8453, 1.3858, 2.6863, 1.3858],
                label: 'ocr text',
                value: 'For',
                confidence: 1,
              },
              {
                boundingBox: [2.8758, 1.3047, 3.0732, 1.3047, 3.0732, 1.3858, 2.8758, 1.3858],
                label: 'ocr text',
                value: 'W-9',
                confidence: 1,
              },
              {
                boundingBox: [3.1179, 1.3051, 3.3889, 1.3051, 3.3889, 1.4003, 3.1179, 1.4003],
                label: 'ocr text',
                value: 'Form,',
                confidence: 1,
              },
              {
                boundingBox: [3.4298, 1.3037, 4.2761, 1.3037, 4.2761, 1.3858, 3.4298, 1.3858],
                label: 'ocr text',
                value: 'www.shi.com/W9',
                confidence: 1,
              },
            ],
          },
          {
            number: 26,
            words: [
              {
                boundingBox: [5.005, 1.2508, 5.2734, 1.2508, 5.2734, 1.3329, 5.005, 1.3329],
                label: 'ocr text',
                value: 'Sales',
                confidence: 1,
              },
              {
                boundingBox: [5.3106, 1.2539, 5.5767, 1.2539, 5.5767, 1.3329, 5.3106, 1.3329],
                label: 'ocr text',
                value: 'team.',
                confidence: 1,
              },
            ],
          },
          {
            number: 27,
            words: [
              {
                boundingBox: [0.206, 1.434, 0.4031, 1.434, 0.4031, 1.5148, 0.206, 1.5148],
                label: 'ocr text',
                value: 'Fax:',
                confidence: 1,
              },
              {
                boundingBox: [0.4487, 1.4337, 1.1304, 1.4337, 1.1304, 1.5149, 0.4487, 1.5149],
                label: 'ocr text',
                value: '732-805-9669',
                confidence: 1,
              },
            ],
          },
          {
            number: 28,
            words: [
              {
                boundingBox: [1.0725, 2.2458, 1.2486, 2.2458, 1.2486, 2.3364, 1.0725, 2.3364],
                label: 'ocr text',
                value: 'Bill',
                confidence: 1,
              },
              {
                boundingBox: [1.2935, 2.2467, 1.4402, 2.2467, 1.4402, 2.338, 1.2935, 2.338],
                label: 'ocr text',
                value: 'To',
                confidence: 1,
              },
            ],
          },
          {
            number: 29,
            words: [
              {
                boundingBox: [4.7687, 2.2443, 5.0302, 2.2443, 5.0302, 2.3622, 4.7687, 2.3622],
                label: 'ocr text',
                value: 'Ship',
                confidence: 1,
              },
              {
                boundingBox: [5.0705, 2.2467, 5.2173, 2.2467, 5.2173, 2.338, 5.0705, 2.338],
                label: 'ocr text',
                value: 'To',
                confidence: 1,
              },
            ],
          },
          {
            number: 30,
            words: [
              {
                boundingBox: [1.0732, 2.3951, 1.5024, 2.3951, 1.5024, 2.4859, 1.0732, 2.4859],
                label: 'ocr text',
                value: 'Finance',
                confidence: 1,
              },
              {
                boundingBox: [1.5462, 2.3936, 1.6507, 2.3936, 1.6507, 2.4859, 1.5462, 2.4859],
                label: 'ocr text',
                value: 'of',
                confidence: 1,
              },
              {
                boundingBox: [1.6809, 2.3951, 2.1339, 2.3951, 2.1339, 2.4859, 1.6809, 2.4859],
                label: 'ocr text',
                value: 'America',
                confidence: 1,
              },
              {
                boundingBox: [2.1837, 2.3951, 2.6551, 2.3951, 2.6551, 2.5107, 2.1837, 2.5107],
                label: 'ocr text',
                value: 'Holdings',
                confidence: 1,
              },
              {
                boundingBox: [2.7037, 2.3936, 2.919, 2.3936, 2.919, 2.4859, 2.7037, 2.4859],
                label: 'ocr text',
                value: 'LLC',
                confidence: 1,
              },
            ],
          },
          {
            number: 31,
            words: [
              {
                boundingBox: [4.774, 2.3951, 5.2032, 2.3951, 5.2032, 2.4859, 4.774, 2.4859],
                label: 'ocr text',
                value: 'Finance',
                confidence: 1,
              },
              {
                boundingBox: [5.247, 2.3936, 5.3515, 2.3936, 5.3515, 2.4859, 5.247, 2.4859],
                label: 'ocr text',
                value: 'of',
                confidence: 1,
              },
              {
                boundingBox: [5.3817, 2.3951, 5.8347, 2.3951, 5.8347, 2.4859, 5.3817, 2.4859],
                label: 'ocr text',
                value: 'America',
                confidence: 1,
              },
            ],
          },
          {
            number: 32,
            words: [
              {
                boundingBox: [1.0682, 2.5428, 1.2655, 2.5428, 1.2655, 2.6342, 1.0682, 2.6342],
                label: 'ocr text',
                value: '300',
                confidence: 1,
              },
              {
                boundingBox: [1.3076, 2.5432, 1.6447, 2.5432, 1.6447, 2.6341, 1.3076, 2.6341],
                label: 'ocr text',
                value: 'Welsh',
                confidence: 1,
              },
              {
                boundingBox: [1.6977, 2.5432, 1.9776, 2.5432, 1.9776, 2.6341, 1.6977, 2.6341],
                label: 'ocr text',
                value: 'Road',
                confidence: 1,
              },
            ],
          },
          {
            number: 33,
            words: [
              {
                boundingBox: [4.769, 2.5428, 4.9663, 2.5428, 4.9663, 2.6342, 4.769, 2.6342],
                label: 'ocr text',
                value: '300',
                confidence: 1,
              },
              {
                boundingBox: [5.0084, 2.5432, 5.3455, 2.5432, 5.3455, 2.6341, 5.0084, 2.6341],
                label: 'ocr text',
                value: 'Welsh',
                confidence: 1,
              },
              {
                boundingBox: [5.3985, 2.5432, 5.6784, 2.5432, 5.6784, 2.6341, 5.3985, 2.6341],
                label: 'ocr text',
                value: 'Road',
                confidence: 1,
              },
            ],
          },
          {
            number: 34,
            words: [
              {
                boundingBox: [1.0711, 2.6914, 1.4854, 2.6914, 1.4854, 2.807, 1.0711, 2.807],
                label: 'ocr text',
                value: 'building',
                confidence: 1,
              },
              {
                boundingBox: [1.5336, 2.6926, 1.5929, 2.6926, 1.5929, 2.7822, 1.5336, 2.7822],
                label: 'ocr text',
                value: '5',
                confidence: 1,
              },
            ],
          },
          {
            number: 35,
            words: [
              {
                boundingBox: [4.7729, 2.6914, 5.1999, 2.6914, 5.1999, 2.807, 4.7729, 2.807],
                label: 'ocr text',
                value: 'Building',
                confidence: 1,
              },
              {
                boundingBox: [5.2445, 2.6914, 5.336, 2.6914, 5.336, 2.7985, 5.2445, 2.7985],
                label: 'ocr text',
                value: '4,',
                confidence: 1,
              },
              {
                boundingBox: [5.3873, 2.6899, 5.6612, 2.6899, 5.6612, 2.7822, 5.3873, 2.7822],
                label: 'ocr text',
                value: 'Suite',
                confidence: 1,
              },
              {
                boundingBox: [5.7045, 2.691, 5.9034, 2.691, 5.9034, 2.7822, 5.7045, 2.7822],
                label: 'ocr text',
                value: '200',
                confidence: 1,
              },
            ],
          },
          {
            number: 36,
            words: [
              {
                boundingBox: [1.073, 2.8395, 1.5936, 2.8395, 1.5936, 2.9466, 1.073, 2.9466],
                label: 'ocr text',
                value: 'Horsham,',
                confidence: 1,
              },
              {
                boundingBox: [1.6489, 2.8395, 1.806, 2.8395, 1.806, 2.929, 1.6489, 2.929],
                label: 'ocr text',
                value: 'PA',
                confidence: 1,
              },
              {
                boundingBox: [1.854, 2.8391, 2.1819, 2.8391, 2.1819, 2.9304, 1.854, 2.9304],
                label: 'ocr text',
                value: '19044',
                confidence: 1,
              },
            ],
          },
          {
            number: 37,
            words: [
              {
                boundingBox: [4.7738, 2.8395, 5.2944, 2.8395, 5.2944, 2.9466, 4.7738, 2.9466],
                label: 'ocr text',
                value: 'Horsham,',
                confidence: 1,
              },
              {
                boundingBox: [5.3497, 2.8395, 5.5068, 2.8395, 5.5068, 2.929, 5.3497, 2.929],
                label: 'ocr text',
                value: 'PA',
                confidence: 1,
              },
              {
                boundingBox: [5.5548, 2.8391, 5.8827, 2.8391, 5.8827, 2.9304, 5.5548, 2.9304],
                label: 'ocr text',
                value: '19044',
                confidence: 1,
              },
            ],
          },
          {
            number: 38,
            words: [
              {
                boundingBox: [1.0729, 2.9862, 1.32, 2.9862, 1.32, 3.0785, 1.0729, 3.0785],
                label: 'ocr text',
                value: 'USA',
                confidence: 1,
              },
            ],
          },
          {
            number: 39,
            words: [
              {
                boundingBox: [4.7737, 2.9862, 5.0208, 2.9862, 5.0208, 3.0785, 4.7737, 3.0785],
                label: 'ocr text',
                value: 'USA',
                confidence: 1,
              },
            ],
          },
          {
            number: 40,
            words: [
              {
                boundingBox: [4.774, 3.1343, 6.381, 3.1343, 6.381, 3.2268, 4.774, 3.2268],
                label: 'ocr text',
                value: 'FAH-20201130-96112-4/Mac',
                confidence: 1,
              },
              {
                boundingBox: [6.4183, 3.1358, 6.7207, 3.1358, 6.7207, 3.2514, 6.4183, 3.2514],
                label: 'ocr text',
                value: 'Wiggi',
                confidence: 1,
              },
            ],
          },
          {
            number: 41,
            words: [
              {
                boundingBox: [0.3663, 3.3601, 0.6278, 3.3601, 0.6278, 3.478, 0.3663, 3.478],
                label: 'ocr text',
                value: 'Ship',
                confidence: 1,
              },
              {
                boundingBox: [0.676, 3.3625, 0.9338, 3.3625, 0.9338, 3.4538, 0.676, 3.4538],
                label: 'ocr text',
                value: 'Date',
                confidence: 1,
              },
            ],
          },
          {
            number: 42,
            words: [
              {
                boundingBox: [1.4261, 3.3601, 2.156, 3.3601, 2.156, 3.478, 1.4261, 3.478],
                label: 'ocr text',
                value: 'Salesperson',
                confidence: 1,
              },
            ],
          },
          {
            number: 43,
            words: [
              {
                boundingBox: [3.0079, 3.3625, 3.5573, 3.3625, 3.5573, 3.4538, 3.0079, 3.4538],
                label: 'ocr text',
                value: 'Purchase',
                confidence: 1,
              },
              {
                boundingBox: [3.6009, 3.3625, 3.9335, 3.3625, 3.9335, 3.4545, 3.6009, 3.4545],
                label: 'ocr text',
                value: 'Order',
                confidence: 1,
              },
            ],
          },
          {
            number: 44,
            words: [
              {
                boundingBox: [5.0166, 3.3601, 5.2781, 3.3601, 5.2781, 3.478, 5.0166, 3.478],
                label: 'ocr text',
                value: 'Ship',
                confidence: 1,
              },
              {
                boundingBox: [5.3191, 3.3616, 5.5005, 3.3616, 5.5005, 3.4538, 5.3191, 3.4538],
                label: 'ocr text',
                value: 'Via',
                confidence: 1,
              },
            ],
          },
          {
            number: 45,
            words: [
              {
                boundingBox: [6.3718, 3.3625, 6.6193, 3.3625, 6.6193, 3.4545, 6.3718, 3.4545],
                label: 'ocr text',
                value: 'FOB',
                confidence: 1,
              },
            ],
          },
          {
            number: 46,
            words: [
              {
                boundingBox: [7.2607, 3.3625, 7.6294, 3.3625, 7.6294, 3.4538, 7.2607, 3.4538],
                label: 'ocr text',
                value: 'Terms',
                confidence: 1,
              },
            ],
          },
          {
            number: 47,
            words: [
              {
                boundingBox: [0.3576, 3.5778, 0.8937, 3.5778, 0.8937, 3.6703, 0.3576, 3.6703],
                label: 'ocr text',
                value: '12/3/2020',
                confidence: 1,
              },
            ],
          },
          {
            number: 48,
            words: [
              {
                boundingBox: [1.2475, 3.5778, 1.7994, 3.5778, 1.7994, 3.6935, 1.2475, 3.6935],
                label: 'ocr text',
                value: 'Stephanie',
                confidence: 1,
              },
              {
                boundingBox: [1.8494, 3.5793, 2.2921, 3.5793, 2.2921, 3.6701, 1.8494, 3.6701],
                label: 'ocr text',
                value: 'Fletcher',
                confidence: 1,
              },
            ],
          },
          {
            number: 49,
            words: [
              {
                boundingBox: [2.774, 3.5789, 4.1053, 3.5789, 4.1053, 3.6703, 2.774, 3.6703],
                label: 'ocr text',
                value: 'FAH-20201130-96112-4',
                confidence: 1,
              },
            ],
          },
          {
            number: 50,
            words: [
              {
                boundingBox: [4.7922, 3.5793, 5.1976, 3.5793, 5.1976, 3.6688, 4.7922, 3.6688],
                label: 'ocr text',
                value: 'FEDEX',
                confidence: 1,
              },
              {
                boundingBox: [5.2395, 3.5776, 5.7815, 3.5776, 5.7815, 3.6701, 5.2395, 3.6701],
                label: 'ocr text',
                value: 'GROUND',
                confidence: 1,
              },
            ],
          },
          {
            number: 51,
            words: [
              {
                boundingBox: [6.1468, 3.5776, 6.3867, 3.5776, 6.3867, 3.6701, 6.1468, 3.6701],
                label: 'ocr text',
                value: 'FOB',
                confidence: 1,
              },
              {
                boundingBox: [6.4338, 3.5776, 6.8616, 3.5776, 6.8616, 3.6701, 6.4338, 3.6701],
                label: 'ocr text',
                value: 'ORIGIN',
                confidence: 1,
              },
            ],
          },
          {
            number: 52,
            words: [
              {
                boundingBox: [7.2341, 3.5793, 7.472, 3.5793, 7.472, 3.6688, 7.2341, 3.6688],
                label: 'ocr text',
                value: 'NET',
                confidence: 1,
              },
              {
                boundingBox: [7.5142, 3.5789, 7.642, 3.5789, 7.642, 3.6703, 7.5142, 3.6703],
                label: 'ocr text',
                value: '30',
                confidence: 1,
              },
            ],
          },
          {
            number: 53,
            words: [
              {
                boundingBox: [0.792, 3.8059, 1.033, 3.8059, 1.033, 3.8973, 0.792, 3.8973],
                label: 'ocr text',
                value: 'Item',
                confidence: 1,
              },
              {
                boundingBox: [1.0841, 3.8059, 1.2687, 3.8059, 1.2687, 3.8973, 1.0841, 3.8973],
                label: 'ocr text',
                value: 'No.',
                confidence: 1,
              },
            ],
          },
          {
            number: 54,
            words: [
              {
                boundingBox: [3.0011, 3.805, 3.6706, 3.805, 3.6706, 3.9214, 3.0011, 3.9214],
                label: 'ocr text',
                value: 'Description',
                confidence: 1,
              },
            ],
          },
          {
            number: 55,
            words: [
              {
                boundingBox: [5.0639, 3.8048, 5.2646, 3.8048, 5.2646, 3.9223, 5.0639, 3.9223],
                label: 'ocr text',
                value: 'Qty',
                confidence: 1,
              },
            ],
          },
          {
            number: 56,
            words: [
              {
                boundingBox: [5.812, 3.8048, 6.0126, 3.8048, 6.0126, 3.9223, 5.812, 3.9223],
                label: 'ocr text',
                value: 'Qty',
                confidence: 1,
              },
            ],
          },
          {
            number: 57,
            words: [
              {
                boundingBox: [6.5473, 3.805, 6.7781, 3.805, 6.7781, 3.8979, 6.5473, 3.8979],
                label: 'ocr text',
                value: 'Unit',
                confidence: 1,
              },
            ],
          },
          {
            number: 58,
            words: [
              {
                boundingBox: [7.272, 3.8059, 7.8173, 3.8059, 7.8173, 3.8973, 7.272, 3.8973],
                label: 'ocr text',
                value: 'Extended',
                confidence: 1,
              },
            ],
          },
          {
            number: 59,
            words: [
              {
                boundingBox: [0.6792, 3.9529, 0.8854, 3.9529, 0.8854, 4.0708, 0.6792, 4.0708],
                label: 'ocr text',
                value: 'Mfg',
                confidence: 1,
              },
              {
                boundingBox: [0.9367, 3.954, 1.1672, 3.954, 1.1672, 4.0454, 0.9367, 4.0454],
                label: 'ocr text',
                value: 'Part',
                confidence: 1,
              },
              {
                boundingBox: [1.2134, 3.954, 1.398, 3.954, 1.398, 4.0454, 1.2134, 4.0454],
                label: 'ocr text',
                value: 'No.',
                confidence: 1,
              },
            ],
          },
          {
            number: 60,
            words: [
              {
                boundingBox: [4.9322, 3.954, 5.4052, 3.954, 5.4052, 4.046, 4.9322, 4.046],
                label: 'ocr text',
                value: 'Ordered',
                confidence: 1,
              },
            ],
          },
          {
            number: 61,
            words: [
              {
                boundingBox: [5.6825, 3.9517, 6.1627, 3.9517, 6.1627, 4.0695, 5.6825, 4.0695],
                label: 'ocr text',
                value: 'Shipped',
                confidence: 1,
              },
            ],
          },
          {
            number: 62,
            words: [
              {
                boundingBox: [6.5289, 3.9532, 6.8214, 3.9532, 6.8214, 4.0454, 6.5289, 4.0454],
                label: 'ocr text',
                value: 'Price',
                confidence: 1,
              },
            ],
          },
          {
            number: 63,
            words: [
              {
                boundingBox: [7.3951, 3.9532, 7.6876, 3.9532, 7.6876, 4.0454, 7.3951, 4.0454],
                label: 'ocr text',
                value: 'Price',
                confidence: 1,
              },
            ],
          },
          {
            number: 64,
            words: [
              {
                boundingBox: [0.2415, 4.1601, 0.7866, 4.1601, 0.7866, 4.2515, 0.2415, 4.2515],
                label: 'ocr text',
                value: '39174133',
                confidence: 1,
              },
            ],
          },
          {
            number: 65,
            words: [
              {
                boundingBox: [1.8994, 4.1605, 2.0963, 4.1605, 2.0963, 4.2514, 1.8994, 4.2514],
                label: 'ocr text',
                value: 'Dell',
                confidence: 1,
              },
              {
                boundingBox: [2.1493, 4.1601, 2.5811, 4.1601, 2.5811, 4.2514, 2.1493, 4.2514],
                label: 'ocr text',
                value: 'P2419H',
                confidence: 1,
              },
              {
                boundingBox: [2.6298, 4.2121, 2.6635, 4.2121, 2.6635, 4.2231, 2.6298, 4.2231],
                label: 'ocr text',
                value: '-',
                confidence: 1,
              },
              {
                boundingBox: [2.7111, 4.1605, 2.9384, 4.1605, 2.9384, 4.25, 2.7111, 4.25],
                label: 'ocr text',
                value: 'LED',
                confidence: 1,
              },
              {
                boundingBox: [2.9879, 4.1605, 3.398, 4.1605, 3.398, 4.2514, 2.9879, 4.2514],
                label: 'ocr text',
                value: 'monitor',
                confidence: 1,
              },
              {
                boundingBox: [3.4349, 4.2121, 3.4686, 4.2121, 3.4686, 4.2231, 3.4349, 4.2231],
                label: 'ocr text',
                value: '-',
                confidence: 1,
              },
              {
                boundingBox: [3.5174, 4.1605, 3.6996, 4.1605, 3.6996, 4.2514, 3.5174, 4.2514],
                label: 'ocr text',
                value: 'Full',
                confidence: 1,
              },
              {
                boundingBox: [3.753, 4.1605, 3.9169, 4.1605, 3.9169, 4.25, 3.753, 4.25],
                label: 'ocr text',
                value: 'HD',
                confidence: 1,
              },
              {
                boundingBox: [3.9658, 4.159, 4.3844, 4.159, 4.3844, 4.2761, 3.9658, 4.2761],
                label: 'ocr text',
                value: '(1080p)',
                confidence: 1,
              },
              {
                boundingBox: [4.4275, 4.2121, 4.4613, 4.2121, 4.4613, 4.2231, 4.4275, 4.2231],
                label: 'ocr text',
                value: '-',
                confidence: 1,
              },
              {
                boundingBox: [4.5034, 4.1601, 4.6328, 4.1601, 4.6328, 4.25, 4.5034, 4.25],
                label: 'ocr text',
                value: '24',
                confidence: 1,
              },
            ],
          },
          {
            number: 66,
            words: [
              {
                boundingBox: [5.095, 4.1601, 5.2228, 4.1601, 5.2228, 4.2514, 5.095, 4.2514],
                label: 'ocr text',
                value: '50',
                confidence: 1,
              },
            ],
          },
          {
            number: 67,
            words: [
              {
                boundingBox: [5.8431, 4.1601, 5.9708, 4.1601, 5.9708, 4.2514, 5.8431, 4.2514],
                label: 'ocr text',
                value: '50',
                confidence: 1,
              },
            ],
          },
          {
            number: 68,
            words: [
              {
                boundingBox: [6.4843, 4.1601, 6.8299, 4.1601, 6.8299, 4.2514, 6.4843, 4.2514],
                label: 'ocr text',
                value: '161.61',
                confidence: 1,
              },
            ],
          },
          {
            number: 69,
            words: [
              {
                boundingBox: [7.3397, 4.1601, 7.8148, 4.1601, 7.8148, 4.2676, 7.3397, 4.2676],
                label: 'ocr text',
                value: '8,080.50',
                confidence: 1,
              },
            ],
          },
          {
            number: 70,
            words: [
              {
                boundingBox: [0.2458, 4.3083, 1.1185, 4.3083, 1.1185, 4.3995, 0.2458, 4.3995],
                label: 'ocr text',
                value: 'DELL-P2419HE',
                confidence: 1,
              },
            ],
          },
          {
            number: 71,
            words: [
              {
                boundingBox: [1.9344, 4.3086, 2.461, 4.3086, 2.461, 4.3995, 1.9344, 4.3995],
                label: 'ocr text',
                value: 'Hardware',
                confidence: 1,
              },
              {
                boundingBox: [2.5108, 4.3086, 3.0374, 4.3086, 3.0374, 4.3995, 2.5108, 4.3995],
                label: 'ocr text',
                value: 'Hardware',
                confidence: 1,
              },
            ],
          },
          {
            number: 72,
            words: [
              {
                boundingBox: [0.2462, 4.4568, 0.7728, 4.4568, 0.7728, 4.5477, 0.2462, 4.5477],
                label: 'ocr text',
                value: 'Hardware',
                confidence: 1,
              },
            ],
          },
          {
            number: 73,
            words: [
              {
                boundingBox: [0.2458, 4.6049, 0.4427, 4.6049, 0.4427, 4.6958, 0.2458, 4.6958],
                label: 'ocr text',
                value: 'Dell',
                confidence: 1,
              },
            ],
          },
          {
            number: 74,
            words: [
              {
                boundingBox: [0.5962, 4.7516, 0.9012, 4.7516, 0.9012, 4.844, 0.5962, 4.844],
                label: 'ocr text',
                value: 'Serial',
                confidence: 1,
              },
              {
                boundingBox: [0.9458, 4.7516, 1.0378, 4.7516, 1.0378, 4.844, 0.9458, 4.844],
                label: 'ocr text',
                value: '#:',
                confidence: 1,
              },
              {
                boundingBox: [1.0896, 4.7516, 1.6262, 4.7516, 1.6262, 4.8441, 1.0896, 4.8441],
                label: 'ocr text',
                value: 'CH1FK53',
                confidence: 1,
              },
            ],
          },
          {
            number: 75,
            words: [
              {
                boundingBox: [0.5962, 4.8997, 0.9012, 4.8997, 0.9012, 4.9921, 0.5962, 4.9921],
                label: 'ocr text',
                value: 'Serial',
                confidence: 1,
              },
              {
                boundingBox: [0.9458, 4.8997, 1.0378, 4.8997, 1.0378, 4.9921, 0.9458, 4.9921],
                label: 'ocr text',
                value: '#:',
                confidence: 1,
              },
              {
                boundingBox: [1.0896, 4.8997, 1.6054, 4.8997, 1.6054, 4.9922, 1.0896, 4.9922],
                label: 'ocr text',
                value: 'C80FK53',
                confidence: 1,
              },
            ],
          },
          {
            number: 76,
            words: [
              {
                boundingBox: [0.5962, 5.0479, 0.9012, 5.0479, 0.9012, 5.1403, 0.5962, 5.1403],
                label: 'ocr text',
                value: 'Serial',
                confidence: 1,
              },
              {
                boundingBox: [0.9458, 5.0479, 1.0378, 5.0479, 1.0378, 5.1403, 0.9458, 5.1403],
                label: 'ocr text',
                value: '#:',
                confidence: 1,
              },
              {
                boundingBox: [1.0929, 5.049, 1.6054, 5.049, 1.6054, 5.1404, 1.0929, 5.1404],
                label: 'ocr text',
                value: 'DL0FK53',
                confidence: 1,
              },
            ],
          },
          {
            number: 77,
            words: [
              {
                boundingBox: [0.5962, 5.196, 0.9012, 5.196, 0.9012, 5.2884, 0.5962, 5.2884],
                label: 'ocr text',
                value: 'Serial',
                confidence: 1,
              },
              {
                boundingBox: [0.9458, 5.196, 1.0378, 5.196, 1.0378, 5.2884, 0.9458, 5.2884],
                label: 'ocr text',
                value: '#:',
                confidence: 1,
              },
              {
                boundingBox: [1.0929, 5.1972, 1.6469, 5.1972, 1.6469, 5.2885, 1.0929, 5.2885],
                label: 'ocr text',
                value: 'DYYDK53',
                confidence: 1,
              },
            ],
          },
          {
            number: 78,
            words: [
              {
                boundingBox: [0.5962, 5.3442, 0.9012, 5.3442, 0.9012, 5.4366, 0.5962, 5.4366],
                label: 'ocr text',
                value: 'Serial',
                confidence: 1,
              },
              {
                boundingBox: [0.9458, 5.3442, 1.0378, 5.3442, 1.0378, 5.4366, 0.9458, 5.4366],
                label: 'ocr text',
                value: '#:',
                confidence: 1,
              },
              {
                boundingBox: [1.0929, 5.3453, 1.6054, 5.3453, 1.6054, 5.4367, 1.0929, 5.4367],
                label: 'ocr text',
                value: 'D80FK53',
                confidence: 1,
              },
            ],
          },
          {
            number: 79,
            words: [
              {
                boundingBox: [0.5962, 5.4923, 0.9012, 5.4923, 0.9012, 5.5847, 0.5962, 5.5847],
                label: 'ocr text',
                value: 'Serial',
                confidence: 1,
              },
              {
                boundingBox: [0.9458, 5.4923, 1.0378, 5.4923, 1.0378, 5.5847, 0.9458, 5.5847],
                label: 'ocr text',
                value: '#:',
                confidence: 1,
              },
              {
                boundingBox: [1.0867, 5.4935, 1.5914, 5.4935, 1.5914, 5.5848, 1.0867, 5.5848],
                label: 'ocr text',
                value: 'JB0FK53',
                confidence: 1,
              },
            ],
          },
          {
            number: 80,
            words: [
              {
                boundingBox: [0.5962, 5.6405, 0.9012, 5.6405, 0.9012, 5.7329, 0.5962, 5.7329],
                label: 'ocr text',
                value: 'Serial',
                confidence: 1,
              },
              {
                boundingBox: [0.9458, 5.6405, 1.0378, 5.6405, 1.0378, 5.7329, 0.9458, 5.7329],
                label: 'ocr text',
                value: '#:',
                confidence: 1,
              },
              {
                boundingBox: [1.0886, 5.6416, 1.5777, 5.6416, 1.5777, 5.733, 1.0886, 5.733],
                label: 'ocr text',
                value: '3J0FK53',
                confidence: 1,
              },
            ],
          },
          {
            number: 81,
            words: [
              {
                boundingBox: [0.5962, 5.7886, 0.9012, 5.7886, 0.9012, 5.881, 0.5962, 5.881],
                label: 'ocr text',
                value: 'Serial',
                confidence: 1,
              },
              {
                boundingBox: [0.9458, 5.7886, 1.0378, 5.7886, 1.0378, 5.881, 0.9458, 5.881],
                label: 'ocr text',
                value: '#:',
                confidence: 1,
              },
              {
                boundingBox: [1.0849, 5.7898, 1.5777, 5.7898, 1.5777, 5.8811, 1.0849, 5.8811],
                label: 'ocr text',
                value: '4J0FK53',
                confidence: 1,
              },
            ],
          },
          {
            number: 82,
            words: [
              {
                boundingBox: [0.5962, 5.9368, 0.9012, 5.9368, 0.9012, 6.0292, 0.5962, 6.0292],
                label: 'ocr text',
                value: 'Serial',
                confidence: 1,
              },
              {
                boundingBox: [0.9458, 5.9368, 1.0378, 5.9368, 1.0378, 6.0292, 0.9458, 6.0292],
                label: 'ocr text',
                value: '#:',
                confidence: 1,
              },
              {
                boundingBox: [1.0881, 5.9379, 1.5777, 5.9379, 1.5777, 6.0293, 1.0881, 6.0293],
                label: 'ocr text',
                value: '6J0FK53',
                confidence: 1,
              },
            ],
          },
          {
            number: 83,
            words: [
              {
                boundingBox: [0.5962, 6.085, 0.9012, 6.085, 0.9012, 6.1773, 0.5962, 6.1773],
                label: 'ocr text',
                value: 'Serial',
                confidence: 1,
              },
              {
                boundingBox: [0.9458, 6.085, 1.0378, 6.085, 1.0378, 6.1773, 0.9458, 6.1773],
                label: 'ocr text',
                value: '#:',
                confidence: 1,
              },
              {
                boundingBox: [1.0892, 6.0861, 1.5777, 6.0861, 1.5777, 6.1775, 1.0892, 6.1775],
                label: 'ocr text',
                value: '7J0FK53',
                confidence: 1,
              },
            ],
          },
          {
            number: 84,
            words: [
              {
                boundingBox: [0.5962, 6.2331, 0.9012, 6.2331, 0.9012, 6.3255, 0.5962, 6.3255],
                label: 'ocr text',
                value: 'Serial',
                confidence: 1,
              },
              {
                boundingBox: [0.9458, 6.2331, 1.0378, 6.2331, 1.0378, 6.3255, 0.9458, 6.3255],
                label: 'ocr text',
                value: '#:',
                confidence: 1,
              },
              {
                boundingBox: [1.0884, 6.2342, 1.5847, 6.2342, 1.5847, 6.3256, 1.0884, 6.3256],
                label: 'ocr text',
                value: '8L0FK53',
                confidence: 1,
              },
            ],
          },
          {
            number: 85,
            words: [
              {
                boundingBox: [0.5962, 6.3813, 0.9012, 6.3813, 0.9012, 6.4736, 0.5962, 6.4736],
                label: 'ocr text',
                value: 'Serial',
                confidence: 1,
              },
              {
                boundingBox: [0.9458, 6.3813, 1.0378, 6.3813, 1.0378, 6.4736, 0.9458, 6.4736],
                label: 'ocr text',
                value: '#:',
                confidence: 1,
              },
              {
                boundingBox: [1.0886, 6.3824, 1.5847, 6.3824, 1.5847, 6.4738, 1.0886, 6.4738],
                label: 'ocr text',
                value: '9L0FK53',
                confidence: 1,
              },
            ],
          },
          {
            number: 86,
            words: [
              {
                boundingBox: [0.5962, 6.5294, 0.9012, 6.5294, 0.9012, 6.6218, 0.5962, 6.6218],
                label: 'ocr text',
                value: 'Serial',
                confidence: 1,
              },
              {
                boundingBox: [0.9458, 6.5294, 1.0378, 6.5294, 1.0378, 6.6218, 0.9458, 6.6218],
                label: 'ocr text',
                value: '#:',
                confidence: 1,
              },
              {
                boundingBox: [1.0886, 6.5305, 1.5847, 6.5305, 1.5847, 6.6219, 1.0886, 6.6219],
                label: 'ocr text',
                value: '901FK53',
                confidence: 1,
              },
            ],
          },
          {
            number: 87,
            words: [
              {
                boundingBox: [0.5962, 6.6776, 0.9012, 6.6776, 0.9012, 6.7699, 0.5962, 6.7699],
                label: 'ocr text',
                value: 'Serial',
                confidence: 1,
              },
              {
                boundingBox: [0.9458, 6.6776, 1.0378, 6.6776, 1.0378, 6.7699, 0.9458, 6.7699],
                label: 'ocr text',
                value: '#:',
                confidence: 1,
              },
              {
                boundingBox: [1.0924, 6.6787, 1.6261, 6.6787, 1.6261, 6.7701, 1.0924, 6.7701],
                label: 'ocr text',
                value: 'BVZMJ43',
                confidence: 1,
              },
            ],
          },
          {
            number: 88,
            words: [
              {
                boundingBox: [0.5962, 6.8257, 0.9012, 6.8257, 0.9012, 6.9181, 0.5962, 6.9181],
                label: 'ocr text',
                value: 'Serial',
                confidence: 1,
              },
              {
                boundingBox: [0.9458, 6.8257, 1.0378, 6.8257, 1.0378, 6.9181, 0.9458, 6.9181],
                label: 'ocr text',
                value: '#:',
                confidence: 1,
              },
              {
                boundingBox: [1.0924, 6.8268, 1.6746, 6.8268, 1.6746, 6.9182, 1.0924, 6.9182],
                label: 'ocr text',
                value: 'BWYDK53',
                confidence: 1,
              },
            ],
          },
          {
            number: 89,
            words: [
              {
                boundingBox: [0.5962, 6.9739, 0.9012, 6.9739, 0.9012, 7.0662, 0.5962, 7.0662],
                label: 'ocr text',
                value: 'Serial',
                confidence: 1,
              },
              {
                boundingBox: [0.9458, 6.9739, 1.0378, 6.9739, 1.0378, 7.0662, 0.9458, 7.0662],
                label: 'ocr text',
                value: '#:',
                confidence: 1,
              },
              {
                boundingBox: [1.0924, 6.975, 1.5984, 6.975, 1.5984, 7.0664, 1.0924, 7.0664],
                label: 'ocr text',
                value: 'B80FK53',
                confidence: 1,
              },
            ],
          },
          {
            number: 90,
            words: [
              {
                boundingBox: [0.5962, 7.122, 0.9012, 7.122, 0.9012, 7.2144, 0.5962, 7.2144],
                label: 'ocr text',
                value: 'Serial',
                confidence: 1,
              },
              {
                boundingBox: [0.9458, 7.122, 1.0378, 7.122, 1.0378, 7.2144, 0.9458, 7.2144],
                label: 'ocr text',
                value: '#:',
                confidence: 1,
              },
              {
                boundingBox: [1.0896, 7.122, 1.6816, 7.122, 1.6816, 7.2145, 1.0896, 7.2145],
                label: 'ocr text',
                value: 'CWYDK53',
                confidence: 1,
              },
            ],
          },
          {
            number: 91,
            words: [
              {
                boundingBox: [0.5962, 7.2702, 0.9012, 7.2702, 0.9012, 7.3625, 0.5962, 7.3625],
                label: 'ocr text',
                value: 'Serial',
                confidence: 1,
              },
              {
                boundingBox: [0.9458, 7.2702, 1.0378, 7.2702, 1.0378, 7.3625, 0.9458, 7.3625],
                label: 'ocr text',
                value: '#:',
                confidence: 1,
              },
              {
                boundingBox: [1.0929, 7.2713, 1.6262, 7.2713, 1.6262, 7.3627, 1.0929, 7.3627],
                label: 'ocr text',
                value: 'DH1FK53',
                confidence: 1,
              },
            ],
          },
          {
            number: 92,
            words: [
              {
                boundingBox: [0.5962, 7.4183, 0.9012, 7.4183, 0.9012, 7.5107, 0.5962, 7.5107],
                label: 'ocr text',
                value: 'Serial',
                confidence: 1,
              },
              {
                boundingBox: [0.9458, 7.4183, 1.0378, 7.4183, 1.0378, 7.5107, 0.9458, 7.5107],
                label: 'ocr text',
                value: '#:',
                confidence: 1,
              },
              {
                boundingBox: [1.0929, 7.4194, 1.6816, 7.4194, 1.6816, 7.5108, 1.0929, 7.5108],
                label: 'ocr text',
                value: 'DWYDK53',
                confidence: 1,
              },
            ],
          },
          {
            number: 93,
            words: [
              {
                boundingBox: [0.5962, 7.5665, 0.9012, 7.5665, 0.9012, 7.6589, 0.5962, 7.6589],
                label: 'ocr text',
                value: 'Serial',
                confidence: 1,
              },
              {
                boundingBox: [0.9458, 7.5665, 1.0378, 7.5665, 1.0378, 7.6589, 0.9458, 7.6589],
                label: 'ocr text',
                value: '#:',
                confidence: 1,
              },
              {
                boundingBox: [1.0936, 7.5676, 1.6329, 7.5676, 1.6329, 7.659, 1.0936, 7.659],
                label: 'ocr text',
                value: 'FDZDK53',
                confidence: 1,
              },
            ],
          },
          {
            number: 94,
            words: [
              {
                boundingBox: [0.5962, 7.7146, 0.9012, 7.7146, 0.9012, 7.807, 0.5962, 7.807],
                label: 'ocr text',
                value: 'Serial',
                confidence: 1,
              },
              {
                boundingBox: [0.9458, 7.7146, 1.0378, 7.7146, 1.0378, 7.807, 0.9458, 7.807],
                label: 'ocr text',
                value: '#:',
                confidence: 1,
              },
              {
                boundingBox: [1.0936, 7.7145, 1.6398, 7.7145, 1.6398, 7.8125, 1.0936, 7.8125],
                label: 'ocr text',
                value: 'FQZDK53',
                confidence: 1,
              },
            ],
          },
          {
            number: 95,
            words: [
              {
                boundingBox: [0.5962, 7.8628, 0.9012, 7.8628, 0.9012, 7.9552, 0.5962, 7.9552],
                label: 'ocr text',
                value: 'Serial',
                confidence: 1,
              },
              {
                boundingBox: [0.9458, 7.8628, 1.0378, 7.8628, 1.0378, 7.9552, 0.9458, 7.9552],
                label: 'ocr text',
                value: '#:',
                confidence: 1,
              },
              {
                boundingBox: [1.0936, 7.8639, 1.6122, 7.8639, 1.6122, 7.9553, 1.0936, 7.9553],
                label: 'ocr text',
                value: 'F6ZDK53',
                confidence: 1,
              },
            ],
          },
          {
            number: 96,
            words: [
              {
                boundingBox: [0.5962, 8.0109, 0.9012, 8.0109, 0.9012, 8.1033, 0.5962, 8.1033],
                label: 'ocr text',
                value: 'Serial',
                confidence: 1,
              },
              {
                boundingBox: [0.9458, 8.0109, 1.0378, 8.0109, 1.0378, 8.1033, 0.9458, 8.1033],
                label: 'ocr text',
                value: '#:',
                confidence: 1,
              },
              {
                boundingBox: [1.0899, 8.0109, 1.6398, 8.0109, 1.6398, 8.1034, 1.0899, 8.1034],
                label: 'ocr text',
                value: 'GTZDK53',
                confidence: 1,
              },
            ],
          },
          {
            number: 97,
            words: [
              {
                boundingBox: [0.5962, 8.1591, 0.9012, 8.1591, 0.9012, 8.2515, 0.5962, 8.2515],
                label: 'ocr text',
                value: 'Serial',
                confidence: 1,
              },
              {
                boundingBox: [0.9458, 8.1591, 1.0378, 8.1591, 1.0378, 8.2515, 0.9458, 8.2515],
                label: 'ocr text',
                value: '#:',
                confidence: 1,
              },
              {
                boundingBox: [1.0933, 8.1602, 1.6192, 8.1602, 1.6192, 8.2516, 1.0933, 8.2516],
                label: 'ocr text',
                value: 'HB0FK53',
                confidence: 1,
              },
            ],
          },
          {
            number: 98,
            words: [
              {
                boundingBox: [0.5962, 8.3072, 0.9012, 8.3072, 0.9012, 8.3996, 0.5962, 8.3996],
                label: 'ocr text',
                value: 'Serial',
                confidence: 1,
              },
              {
                boundingBox: [0.9458, 8.3072, 1.0378, 8.3072, 1.0378, 8.3996, 0.9458, 8.3996],
                label: 'ocr text',
                value: '#:',
                confidence: 1,
              },
              {
                boundingBox: [1.0933, 8.3084, 1.6816, 8.3084, 1.6816, 8.3997, 1.0933, 8.3997],
                label: 'ocr text',
                value: 'HWYDK53',
                confidence: 1,
              },
            ],
          },
          {
            number: 99,
            words: [
              {
                boundingBox: [0.5962, 8.4554, 0.9012, 8.4554, 0.9012, 8.5478, 0.5962, 8.5478],
                label: 'ocr text',
                value: 'Serial',
                confidence: 1,
              },
              {
                boundingBox: [0.9458, 8.4554, 1.0378, 8.4554, 1.0378, 8.5478, 0.9458, 8.5478],
                label: 'ocr text',
                value: '#:',
                confidence: 1,
              },
              {
                boundingBox: [1.0867, 8.4565, 1.6122, 8.4565, 1.6122, 8.5479, 1.0867, 8.5479],
                label: 'ocr text',
                value: 'JBZDK53',
                confidence: 1,
              },
            ],
          },
          {
            number: 100,
            words: [
              {
                boundingBox: [0.5962, 8.6035, 0.9012, 8.6035, 0.9012, 8.6959, 0.5962, 8.6959],
                label: 'ocr text',
                value: 'Serial',
                confidence: 1,
              },
              {
                boundingBox: [0.9458, 8.6035, 1.0378, 8.6035, 1.0378, 8.6959, 0.9458, 8.6959],
                label: 'ocr text',
                value: '#:',
                confidence: 1,
              },
              {
                boundingBox: [1.0867, 8.6035, 1.6192, 8.6035, 1.6192, 8.696, 1.0867, 8.696],
                label: 'ocr text',
                value: 'JCZDK53',
                confidence: 1,
              },
            ],
          },
          {
            number: 101,
            words: [
              {
                boundingBox: [0.5962, 8.7517, 0.9012, 8.7517, 0.9012, 8.8441, 0.5962, 8.8441],
                label: 'ocr text',
                value: 'Serial',
                confidence: 1,
              },
              {
                boundingBox: [0.9458, 8.7517, 1.0378, 8.7517, 1.0378, 8.8441, 0.9458, 8.8441],
                label: 'ocr text',
                value: '#:',
                confidence: 1,
              },
              {
                boundingBox: [1.0867, 8.7528, 1.6192, 8.7528, 1.6192, 8.8442, 1.0867, 8.8442],
                label: 'ocr text',
                value: 'JVYDK53',
                confidence: 1,
              },
            ],
          },
          {
            number: 102,
            words: [
              {
                boundingBox: [0.5962, 8.8998, 0.9012, 8.8998, 0.9012, 8.9922, 0.5962, 8.9922],
                label: 'ocr text',
                value: 'Serial',
                confidence: 1,
              },
              {
                boundingBox: [0.9458, 8.8998, 1.0378, 8.8998, 1.0378, 8.9922, 0.9458, 8.9922],
                label: 'ocr text',
                value: '#:',
                confidence: 1,
              },
              {
                boundingBox: [1.0867, 8.901, 1.5984, 8.901, 1.5984, 8.9923, 1.0867, 8.9923],
                label: 'ocr text',
                value: 'J1ZDK53',
                confidence: 1,
              },
            ],
          },
          {
            number: 103,
            words: [
              {
                boundingBox: [0.5962, 9.048, 0.9012, 9.048, 0.9012, 9.1404, 0.5962, 9.1404],
                label: 'ocr text',
                value: 'Serial',
                confidence: 1,
              },
              {
                boundingBox: [0.9458, 9.048, 1.0378, 9.048, 1.0378, 9.1404, 0.9458, 9.1404],
                label: 'ocr text',
                value: '#:',
                confidence: 1,
              },
              {
                boundingBox: [1.0867, 9.0491, 1.5984, 9.0491, 1.5984, 9.1405, 1.0867, 9.1405],
                label: 'ocr text',
                value: 'J6ZDK53',
                confidence: 1,
              },
            ],
          },
          {
            number: 104,
            words: [
              {
                boundingBox: [0.5962, 9.1962, 0.9012, 9.1962, 0.9012, 9.2885, 0.5962, 9.2885],
                label: 'ocr text',
                value: 'Serial',
                confidence: 1,
              },
              {
                boundingBox: [0.9458, 9.1962, 1.0378, 9.1962, 1.0378, 9.2885, 0.9458, 9.2885],
                label: 'ocr text',
                value: '#:',
                confidence: 1,
              },
              {
                boundingBox: [1.0969, 9.1973, 1.6054, 9.1973, 1.6054, 9.2887, 1.0969, 9.2887],
                label: 'ocr text',
                value: '17ZDK53',
                confidence: 1,
              },
            ],
          },
          {
            number: 105,
            words: [
              {
                boundingBox: [0.5962, 9.3443, 0.9012, 9.3443, 0.9012, 9.4367, 0.5962, 9.4367],
                label: 'ocr text',
                value: 'Serial',
                confidence: 1,
              },
              {
                boundingBox: [0.9458, 9.3443, 1.0378, 9.3443, 1.0378, 9.4367, 0.9458, 9.4367],
                label: 'ocr text',
                value: '#:',
                confidence: 1,
              },
              {
                boundingBox: [1.0869, 9.3443, 1.6054, 9.3443, 1.6054, 9.4368, 1.0869, 9.4368],
                label: 'ocr text',
                value: '2C0FK53',
                confidence: 1,
              },
            ],
          },
          {
            number: 106,
            words: [
              {
                boundingBox: [0.5962, 9.4925, 0.9012, 9.4925, 0.9012, 9.5848, 0.5962, 9.5848],
                label: 'ocr text',
                value: 'Serial',
                confidence: 1,
              },
              {
                boundingBox: [0.9458, 9.4925, 1.0378, 9.4925, 1.0378, 9.5848, 0.9458, 9.5848],
                label: 'ocr text',
                value: '#:',
                confidence: 1,
              },
              {
                boundingBox: [1.0869, 9.4936, 1.6262, 9.4936, 1.6262, 9.585, 1.0869, 9.585],
                label: 'ocr text',
                value: '2RZDK53',
                confidence: 1,
              },
            ],
          },
          {
            number: 107,
            words: [
              {
                boundingBox: [0.5962, 9.6406, 0.9012, 9.6406, 0.9012, 9.733, 0.5962, 9.733],
                label: 'ocr text',
                value: 'Serial',
                confidence: 1,
              },
              {
                boundingBox: [0.9458, 9.6406, 1.0378, 9.6406, 1.0378, 9.733, 0.9458, 9.733],
                label: 'ocr text',
                value: '#:',
                confidence: 1,
              },
              {
                boundingBox: [1.0869, 9.6417, 1.6262, 9.6417, 1.6262, 9.7331, 1.0869, 9.7331],
                label: 'ocr text',
                value: '2XYDK53',
                confidence: 1,
              },
            ],
          },
          {
            number: 108,
            words: [
              {
                boundingBox: [0.5962, 9.7888, 0.9012, 9.7888, 0.9012, 9.8811, 0.5962, 9.8811],
                label: 'ocr text',
                value: 'Serial',
                confidence: 1,
              },
              {
                boundingBox: [0.9458, 9.7888, 1.0378, 9.7888, 1.0378, 9.8811, 0.9458, 9.8811],
                label: 'ocr text',
                value: '#:',
                confidence: 1,
              },
              {
                boundingBox: [1.0869, 9.7899, 1.6054, 9.7899, 1.6054, 9.8813, 1.0869, 9.8813],
                label: 'ocr text',
                value: '27ZDK53',
                confidence: 1,
              },
            ],
          },
          {
            number: 109,
            words: [
              {
                boundingBox: [0.5962, 9.9369, 0.9012, 9.9369, 0.9012, 10.0293, 0.5962, 10.0293],
                label: 'ocr text',
                value: 'Serial',
                confidence: 1,
              },
              {
                boundingBox: [0.9458, 9.9369, 1.0378, 9.9369, 1.0378, 10.0293, 0.9458, 10.0293],
                label: 'ocr text',
                value: '#:',
                confidence: 1,
              },
              {
                boundingBox: [1.0886, 9.938, 1.6192, 9.938, 1.6192, 10.0294, 1.0886, 10.0294],
                label: 'ocr text',
                value: '3KZDK53',
                confidence: 1,
              },
            ],
          },
          {
            number: 110,
            words: [
              {
                boundingBox: [0.5962, 10.0851, 0.9012, 10.0851, 0.9012, 10.1774, 0.5962, 10.1774],
                label: 'ocr text',
                value: 'Serial',
                confidence: 1,
              },
              {
                boundingBox: [0.9458, 10.0851, 1.0378, 10.0851, 1.0378, 10.1774, 0.9458, 10.1774],
                label: 'ocr text',
                value: '#:',
                confidence: 1,
              },
              {
                boundingBox: [1.0886, 10.0862, 1.6262, 10.0862, 1.6262, 10.1776, 1.0886, 10.1776],
                label: 'ocr text',
                value: '3XYDK53',
                confidence: 1,
              },
            ],
          },
          {
            number: 111,
            words: [
              {
                boundingBox: [6.8206, 10.2592, 7.0976, 10.2592, 7.0976, 10.3748, 6.8206, 10.3748],
                label: 'ocr text',
                value: 'Page',
                confidence: 1,
              },
              {
                boundingBox: [7.1856, 10.2588, 7.2186, 10.2588, 7.2186, 10.3487, 7.1856, 10.3487],
                label: 'ocr text',
                value: '1',
                confidence: 1,
              },
              {
                boundingBox: [7.3149, 10.2577, 7.4194, 10.2577, 7.4194, 10.3501, 7.3149, 10.3501],
                label: 'ocr text',
                value: 'of',
                confidence: 1,
              },
              {
                boundingBox: [7.4878, 10.2588, 7.547, 10.2588, 7.547, 10.3487, 7.4878, 10.3487],
                label: 'ocr text',
                value: '2',
                confidence: 1,
              },
            ],
          },
        ],
      },
      {
        number: 2,
        lines: [
          {
            number: 0,
            words: [
              {
                boundingBox: [0.2494, 0.1769, 1.3693, 0.1497, 1.3874, 0.7483, 0.263, 0.78],
                label: 'ocr text',
                value: 'shi',
                confidence: 0.981,
              },
            ],
          },
          {
            number: 1,
            words: [
              {
                boundingBox: [2.6857, 0.1198, 3.0122, 0.1198, 3.0122, 0.2006, 2.6857, 0.2006],
                label: 'ocr text',
                value: 'Please',
                confidence: 1,
              },
              {
                boundingBox: [3.0547, 0.1198, 3.2936, 0.1198, 3.2936, 0.2006, 3.0547, 0.2006],
                label: 'ocr text',
                value: 'remit',
                confidence: 1,
              },
              {
                boundingBox: [3.3324, 0.1216, 3.7504, 0.1216, 3.7504, 0.2226, 3.3324, 0.2226],
                label: 'ocr text',
                value: 'payment',
                confidence: 1,
              },
              {
                boundingBox: [3.7838, 0.1216, 3.8955, 0.1216, 3.8955, 0.2006, 3.7838, 0.2006],
                label: 'ocr text',
                value: 'to:',
                confidence: 1,
              },
            ],
          },
          {
            number: 2,
            words: [
              {
                boundingBox: [5.0509, 0.1236, 5.6558, 0.1236, 5.6558, 0.2569, 5.0509, 0.2569],
                label: 'ocr text',
                value: 'Invoice',
                confidence: 1,
              },
              {
                boundingBox: [5.7233, 0.1249, 5.99, 0.1249, 5.99, 0.2569, 5.7233, 0.2569],
                label: 'ocr text',
                value: 'No.',
                confidence: 1,
              },
            ],
          },
          {
            number: 3,
            words: [
              {
                boundingBox: [6.431, 0.1249, 7.3447, 0.1249, 7.3447, 0.2578, 6.431, 0.2578],
                label: 'ocr text',
                value: 'B12684109',
                confidence: 1,
              },
            ],
          },
          {
            number: 4,
            words: [
              {
                boundingBox: [2.6822, 0.2502, 2.8523, 0.2502, 2.8523, 0.3323, 2.6822, 0.3323],
                label: 'ocr text',
                value: 'SHI',
                confidence: 1,
              },
              {
                boundingBox: [2.9033, 0.2515, 3.4963, 0.2515, 3.4963, 0.3323, 2.9033, 0.3323],
                label: 'ocr text',
                value: 'International',
                confidence: 1,
              },
              {
                boundingBox: [3.5404, 0.2502, 3.7712, 0.2502, 3.7712, 0.3531, 3.5404, 0.3531],
                label: 'ocr text',
                value: 'Corp',
                confidence: 1,
              },
            ],
          },
          {
            number: 5,
            words: [
              {
                boundingBox: [2.6857, 0.3818, 2.8895, 0.3818, 2.8895, 0.464, 2.6857, 0.464],
                label: 'ocr text',
                value: 'P.O.',
                confidence: 1,
              },
              {
                boundingBox: [2.9379, 0.3832, 3.1204, 0.3832, 3.1204, 0.464, 2.9379, 0.464],
                label: 'ocr text',
                value: 'Box',
                confidence: 1,
              },
              {
                boundingBox: [3.1566, 0.3829, 3.5023, 0.3829, 3.5023, 0.464, 3.1566, 0.464],
                label: 'ocr text',
                value: '952121',
                confidence: 1,
              },
            ],
          },
          {
            number: 6,
            words: [
              {
                boundingBox: [5.051, 0.3349, 5.4301, 0.3349, 5.4301, 0.4258, 5.051, 0.4258],
                label: 'ocr text',
                value: 'Invoice',
                confidence: 1,
              },
              {
                boundingBox: [5.4741, 0.3349, 5.7079, 0.3349, 5.7079, 0.4258, 5.4741, 0.4258],
                label: 'ocr text',
                value: 'date',
                confidence: 1,
              },
            ],
          },
          {
            number: 7,
            words: [
              {
                boundingBox: [6.4309, 0.3334, 6.9671, 0.3334, 6.9671, 0.4259, 6.4309, 0.4259],
                label: 'ocr text',
                value: '12/3/2020',
                confidence: 1,
              },
            ],
          },
          {
            number: 8,
            words: [
              {
                boundingBox: [2.6857, 0.5149, 3.0068, 0.5149, 3.0068, 0.6101, 2.6857, 0.6101],
                label: 'ocr text',
                value: 'Dallas,',
                confidence: 1,
              },
              {
                boundingBox: [3.0499, 0.5149, 3.1886, 0.5149, 3.1886, 0.5945, 3.0499, 0.5945],
                label: 'ocr text',
                value: 'TX',
                confidence: 1,
              },
              {
                boundingBox: [3.2252, 0.5146, 3.7926, 0.5146, 3.7926, 0.5958, 3.2252, 0.5958],
                label: 'ocr text',
                value: '75395-2121',
                confidence: 1,
              },
            ],
          },
          {
            number: 9,
            words: [
              {
                boundingBox: [5.0456, 0.4816, 5.5827, 0.4816, 5.5827, 0.574, 5.0456, 0.574],
                label: 'ocr text',
                value: 'Customer',
                confidence: 1,
              },
              {
                boundingBox: [5.6239, 0.4831, 6.0411, 0.4831, 6.0411, 0.574, 5.6239, 0.574],
                label: 'ocr text',
                value: 'number',
                confidence: 1,
              },
            ],
          },
          {
            number: 10,
            words: [
              {
                boundingBox: [6.4309, 0.4827, 6.8981, 0.4827, 6.8981, 0.574, 6.4309, 0.574],
                label: 'ocr text',
                value: '1081046',
                confidence: 1,
              },
            ],
          },
          {
            number: 11,
            words: [
              {
                boundingBox: [2.6785, 0.6466, 2.9008, 0.6466, 2.9008, 0.7274, 2.6785, 0.7274],
                label: 'ocr text',
                value: 'Wire',
                confidence: 1,
              },
              {
                boundingBox: [2.9435, 0.6453, 3.5066, 0.6453, 3.5066, 0.7274, 2.9435, 0.7274],
                label: 'ocr text',
                value: 'information:',
                confidence: 1,
              },
              {
                boundingBox: [3.5484, 0.6466, 3.8142, 0.6466, 3.8142, 0.7274, 3.5484, 0.7274],
                label: 'ocr text',
                value: 'Wells',
                confidence: 1,
              },
              {
                boundingBox: [3.8584, 0.6466, 4.1353, 0.6466, 4.1353, 0.7494, 3.8584, 0.7494],
                label: 'ocr text',
                value: 'Fargo',
                confidence: 1,
              },
              {
                boundingBox: [4.1783, 0.6466, 4.4228, 0.6466, 4.4228, 0.7274, 4.1783, 0.7274],
                label: 'ocr text',
                value: 'Bank',
                confidence: 1,
              },
            ],
          },
          {
            number: 12,
            words: [
              {
                boundingBox: [5.045, 0.6297, 5.347, 0.6297, 5.347, 0.7221, 5.045, 0.7221],
                label: 'ocr text',
                value: 'Sales',
                confidence: 1,
              },
              {
                boundingBox: [5.3906, 0.6312, 5.68, 0.6312, 5.68, 0.7221, 5.3906, 0.7221],
                label: 'ocr text',
                value: 'order',
                confidence: 1,
              },
            ],
          },
          {
            number: 13,
            words: [
              {
                boundingBox: [6.4229, 0.6297, 7.0509, 0.6297, 7.0509, 0.7222, 6.4229, 0.7222],
                label: 'ocr text',
                value: 'S52873863',
                confidence: 1,
              },
            ],
          },
          {
            number: 14,
            words: [
              {
                boundingBox: [2.6785, 0.7783, 2.9008, 0.7783, 2.9008, 0.8591, 2.6785, 0.8591],
                label: 'ocr text',
                value: 'Wire',
                confidence: 1,
              },
              {
                boundingBox: [2.9449, 0.777, 3.1075, 0.777, 3.1075, 0.8591, 2.9449, 0.8591],
                label: 'ocr text',
                value: 'Rt#',
                confidence: 1,
              },
              {
                boundingBox: [3.1518, 0.778, 3.6908, 0.778, 3.6908, 0.8591, 3.1518, 0.8591],
                label: 'ocr text',
                value: '121000248',
                confidence: 1,
              },
            ],
          },
          {
            number: 15,
            words: [
              {
                boundingBox: [0.206, 0.9072, 0.5656, 0.9072, 0.5656, 0.988, 0.206, 0.988],
                label: 'ocr text',
                value: 'Federal',
                confidence: 1,
              },
              {
                boundingBox: [0.6062, 0.909, 0.7515, 0.909, 0.7515, 0.988, 0.6062, 0.988],
                label: 'ocr text',
                value: 'tax',
                confidence: 1,
              },
              {
                boundingBox: [0.7934, 0.9072, 0.9152, 0.9072, 0.9152, 0.9868, 0.7934, 0.9868],
                label: 'ocr text',
                value: 'ID:',
                confidence: 1,
              },
              {
                boundingBox: [0.9589, 0.9069, 1.5437, 0.9069, 1.5437, 0.9881, 0.9589, 0.9881],
                label: 'ocr text',
                value: '22-3009648',
                confidence: 1,
              },
            ],
          },
          {
            number: 16,
            words: [
              {
                boundingBox: [2.6772, 0.9087, 2.9027, 0.9087, 2.9027, 0.9908, 2.6772, 0.9908],
                label: 'ocr text',
                value: 'ACH',
                confidence: 1,
              },
              {
                boundingBox: [2.9512, 0.9087, 3.1137, 0.9087, 3.1137, 0.9908, 2.9512, 0.9908],
                label: 'ocr text',
                value: 'Rt#',
                confidence: 1,
              },
              {
                boundingBox: [3.1506, 0.9097, 3.6975, 0.9097, 3.6975, 0.9908, 3.1506, 0.9908],
                label: 'ocr text',
                value: '021200025',
                confidence: 1,
              },
            ],
          },
          {
            number: 17,
            words: [
              {
                boundingBox: [5.0091, 0.857, 5.3906, 0.857, 5.3906, 0.9378, 5.0091, 0.9378],
                label: 'ocr text',
                value: 'Finance',
                confidence: 1,
              },
              {
                boundingBox: [5.4302, 0.857, 5.761, 0.857, 5.761, 0.9598, 5.4302, 0.9598],
                label: 'ocr text',
                value: 'charge',
                confidence: 1,
              },
              {
                boundingBox: [5.8, 0.8557, 5.8929, 0.8557, 5.8929, 0.9378, 5.8, 0.9378],
                label: 'ocr text',
                value: 'of',
                confidence: 1,
              },
              {
                boundingBox: [5.9318, 0.8557, 6.166, 0.8557, 6.166, 0.9394, 5.9318, 0.9394],
                label: 'ocr text',
                value: '1.5%',
                confidence: 1,
              },
              {
                boundingBox: [6.2109, 0.8777, 6.3657, 0.8777, 6.3657, 0.9586, 6.2109, 0.9586],
                label: 'ocr text',
                value: 'per',
                confidence: 1,
              },
              {
                boundingBox: [6.4022, 0.857, 6.696, 0.857, 6.696, 0.9378, 6.4022, 0.9378],
                label: 'ocr text',
                value: 'month',
                confidence: 1,
              },
              {
                boundingBox: [6.7347, 0.857, 6.8808, 0.857, 6.8808, 0.9366, 6.7347, 0.9366],
                label: 'ocr text',
                value: 'will',
                confidence: 1,
              },
              {
                boundingBox: [6.9266, 0.857, 7.0383, 0.857, 7.0383, 0.9378, 6.9266, 0.9378],
                label: 'ocr text',
                value: 'be',
                confidence: 1,
              },
              {
                boundingBox: [7.078, 0.857, 7.4671, 0.857, 7.4671, 0.9598, 7.078, 0.9598],
                label: 'ocr text',
                value: 'charged',
                confidence: 1,
              },
              {
                boundingBox: [7.5096, 0.8777, 7.6218, 0.8777, 7.6218, 0.9378, 7.5096, 0.9378],
                label: 'ocr text',
                value: 'on',
                confidence: 1,
              },
            ],
          },
          {
            number: 18,
            words: [
              {
                boundingBox: [0.2001, 1.0386, 0.3769, 1.0386, 0.3769, 1.1197, 0.2001, 1.1197],
                label: 'ocr text',
                value: '290',
                confidence: 1,
              },
              {
                boundingBox: [0.4215, 1.0389, 0.8684, 1.0389, 0.8684, 1.1197, 0.4215, 1.1197],
                label: 'ocr text',
                value: 'Davidson',
                confidence: 1,
              },
              {
                boundingBox: [0.9069, 1.0389, 1.1194, 1.0389, 1.1194, 1.1197, 0.9069, 1.1197],
                label: 'ocr text',
                value: 'Ave.',
                confidence: 1,
              },
            ],
          },
          {
            number: 19,
            words: [
              {
                boundingBox: [2.6772, 1.0403, 3.9379, 1.0403, 3.9379, 1.1226, 2.6772, 1.1226],
                label: 'ocr text',
                value: 'Account#2000037641964',
                confidence: 1,
              },
            ],
          },
          {
            number: 20,
            words: [
              {
                boundingBox: [5.0073, 0.9905, 5.2092, 0.9905, 5.2092, 1.0903, 5.0073, 1.0903],
                label: 'ocr text',
                value: 'past',
                confidence: 1,
              },
              {
                boundingBox: [5.2444, 0.9887, 5.4214, 0.9887, 5.4214, 1.0695, 5.2444, 1.0695],
                label: 'ocr text',
                value: 'due',
                confidence: 1,
              },
              {
                boundingBox: [5.4608, 0.9905, 5.897, 0.9905, 5.897, 1.0695, 5.4608, 1.0695],
                label: 'ocr text',
                value: 'accounts',
                confidence: 1,
              },
              {
                boundingBox: [5.9357, 1.0346, 5.9657, 1.0346, 5.9657, 1.0444, 5.9357, 1.0444],
                label: 'ocr text',
                value: '-',
                confidence: 1,
              },
              {
                boundingBox: [6.012, 0.9874, 6.3668, 0.9874, 6.3668, 1.0915, 6.012, 1.0915],
                label: 'ocr text',
                value: '18%/yr.',
                confidence: 1,
              },
            ],
          },
          {
            number: 21,
            words: [
              {
                boundingBox: [0.2019, 1.1693, 0.6931, 1.1693, 0.6931, 1.2658, 0.2019, 1.2658],
                label: 'ocr text',
                value: 'Somerset,',
                confidence: 1,
              },
              {
                boundingBox: [0.7421, 1.1706, 0.8607, 1.1706, 0.8607, 1.2514, 0.7421, 1.2514],
                label: 'ocr text',
                value: 'NJ',
                confidence: 1,
              },
              {
                boundingBox: [0.9049, 1.1703, 1.2041, 1.1703, 1.2041, 1.2515, 0.9049, 1.2515],
                label: 'ocr text',
                value: '08873',
                confidence: 1,
              },
            ],
          },
          {
            number: 22,
            words: [
              {
                boundingBox: [2.6822, 1.172, 3.0202, 1.172, 3.0202, 1.2541, 2.6822, 1.2541],
                label: 'ocr text',
                value: 'SWIFT',
                confidence: 1,
              },
              {
                boundingBox: [3.0586, 1.172, 3.3397, 1.172, 3.3397, 1.2541, 3.0586, 1.2541],
                label: 'ocr text',
                value: 'Code:',
                confidence: 1,
              },
              {
                boundingBox: [3.3815, 1.172, 3.9418, 1.172, 3.9418, 1.2541, 3.3815, 1.2541],
                label: 'ocr text',
                value: 'WFBIUS6S',
                confidence: 1,
              },
            ],
          },
          {
            number: 23,
            words: [
              {
                boundingBox: [5, 1.1204, 5.1156, 1.1204, 5.1156, 1.2, 5, 1.2],
                label: 'ocr text',
                value: 'All',
                confidence: 1,
              },
              {
                boundingBox: [5.1613, 1.1222, 5.4954, 1.1222, 5.4954, 1.2012, 5.1613, 1.2012],
                label: 'ocr text',
                value: 'returns',
                confidence: 1,
              },
              {
                boundingBox: [5.5378, 1.1204, 5.8718, 1.1204, 5.8718, 1.222, 5.5378, 1.222],
                label: 'ocr text',
                value: 'require',
                confidence: 1,
              },
              {
                boundingBox: [5.9111, 1.1411, 6.023, 1.1411, 6.023, 1.2012, 5.9111, 1.2012],
                label: 'ocr text',
                value: 'an',
                confidence: 1,
              },
              {
                boundingBox: [6.0702, 1.1191, 6.3686, 1.1191, 6.3686, 1.2012, 6.0702, 1.2012],
                label: 'ocr text',
                value: 'RMA#',
                confidence: 1,
              },
              {
                boundingBox: [6.4042, 1.1204, 6.8066, 1.1204, 6.8066, 1.222, 6.4042, 1.222],
                label: 'ocr text',
                value: 'supplied',
                confidence: 1,
              },
              {
                boundingBox: [6.8526, 1.1204, 6.9617, 1.1204, 6.9617, 1.2232, 6.8526, 1.2232],
                label: 'ocr text',
                value: 'by',
                confidence: 1,
              },
              {
                boundingBox: [6.9952, 1.1411, 7.2111, 1.1411, 7.2111, 1.2232, 6.9952, 1.2232],
                label: 'ocr text',
                value: 'your',
                confidence: 1,
              },
              {
                boundingBox: [7.2453, 1.1191, 7.4154, 1.1191, 7.4154, 1.2012, 7.2453, 1.2012],
                label: 'ocr text',
                value: 'SHI',
                confidence: 1,
              },
            ],
          },
          {
            number: 24,
            words: [
              {
                boundingBox: [0.2054, 1.3023, 0.5391, 1.3023, 0.5391, 1.3831, 0.2054, 1.3831],
                label: 'ocr text',
                value: 'Phone:',
                confidence: 1,
              },
              {
                boundingBox: [0.5841, 1.302, 1.251, 1.302, 1.251, 1.3832, 0.5841, 1.3832],
                label: 'ocr text',
                value: '888-235-3871',
                confidence: 1,
              },
            ],
          },
          {
            number: 25,
            words: [
              {
                boundingBox: [2.6863, 1.3051, 2.8453, 1.3051, 2.8453, 1.3858, 2.6863, 1.3858],
                label: 'ocr text',
                value: 'For',
                confidence: 1,
              },
              {
                boundingBox: [2.8758, 1.3047, 3.0732, 1.3047, 3.0732, 1.3858, 2.8758, 1.3858],
                label: 'ocr text',
                value: 'W-9',
                confidence: 1,
              },
              {
                boundingBox: [3.1179, 1.3051, 3.3889, 1.3051, 3.3889, 1.4003, 3.1179, 1.4003],
                label: 'ocr text',
                value: 'Form,',
                confidence: 1,
              },
              {
                boundingBox: [3.4298, 1.3037, 4.2761, 1.3037, 4.2761, 1.3858, 3.4298, 1.3858],
                label: 'ocr text',
                value: 'www.shi.com/W9',
                confidence: 1,
              },
            ],
          },
          {
            number: 26,
            words: [
              {
                boundingBox: [5.005, 1.2508, 5.2734, 1.2508, 5.2734, 1.3329, 5.005, 1.3329],
                label: 'ocr text',
                value: 'Sales',
                confidence: 1,
              },
              {
                boundingBox: [5.3106, 1.2539, 5.5767, 1.2539, 5.5767, 1.3329, 5.3106, 1.3329],
                label: 'ocr text',
                value: 'team.',
                confidence: 1,
              },
            ],
          },
          {
            number: 27,
            words: [
              {
                boundingBox: [0.206, 1.434, 0.4031, 1.434, 0.4031, 1.5148, 0.206, 1.5148],
                label: 'ocr text',
                value: 'Fax:',
                confidence: 1,
              },
              {
                boundingBox: [0.4487, 1.4337, 1.1304, 1.4337, 1.1304, 1.5149, 0.4487, 1.5149],
                label: 'ocr text',
                value: '732-805-9669',
                confidence: 1,
              },
            ],
          },
          {
            number: 28,
            words: [
              {
                boundingBox: [1.0725, 2.2458, 1.2486, 2.2458, 1.2486, 2.3364, 1.0725, 2.3364],
                label: 'ocr text',
                value: 'Bill',
                confidence: 1,
              },
              {
                boundingBox: [1.2935, 2.2467, 1.4402, 2.2467, 1.4402, 2.338, 1.2935, 2.338],
                label: 'ocr text',
                value: 'To',
                confidence: 1,
              },
            ],
          },
          {
            number: 29,
            words: [
              {
                boundingBox: [4.7687, 2.2443, 5.0302, 2.2443, 5.0302, 2.3622, 4.7687, 2.3622],
                label: 'ocr text',
                value: 'Ship',
                confidence: 1,
              },
              {
                boundingBox: [5.0705, 2.2467, 5.2173, 2.2467, 5.2173, 2.338, 5.0705, 2.338],
                label: 'ocr text',
                value: 'To',
                confidence: 1,
              },
            ],
          },
          {
            number: 30,
            words: [
              {
                boundingBox: [1.0732, 2.3951, 1.5024, 2.3951, 1.5024, 2.4859, 1.0732, 2.4859],
                label: 'ocr text',
                value: 'Finance',
                confidence: 1,
              },
              {
                boundingBox: [1.5462, 2.3936, 1.6507, 2.3936, 1.6507, 2.4859, 1.5462, 2.4859],
                label: 'ocr text',
                value: 'of',
                confidence: 1,
              },
              {
                boundingBox: [1.6809, 2.3951, 2.1339, 2.3951, 2.1339, 2.4859, 1.6809, 2.4859],
                label: 'ocr text',
                value: 'America',
                confidence: 1,
              },
              {
                boundingBox: [2.1837, 2.3951, 2.6551, 2.3951, 2.6551, 2.5107, 2.1837, 2.5107],
                label: 'ocr text',
                value: 'Holdings',
                confidence: 1,
              },
              {
                boundingBox: [2.7037, 2.3936, 2.919, 2.3936, 2.919, 2.4859, 2.7037, 2.4859],
                label: 'ocr text',
                value: 'LLC',
                confidence: 1,
              },
            ],
          },
          {
            number: 31,
            words: [
              {
                boundingBox: [4.774, 2.3951, 5.2032, 2.3951, 5.2032, 2.4859, 4.774, 2.4859],
                label: 'ocr text',
                value: 'Finance',
                confidence: 1,
              },
              {
                boundingBox: [5.247, 2.3936, 5.3515, 2.3936, 5.3515, 2.4859, 5.247, 2.4859],
                label: 'ocr text',
                value: 'of',
                confidence: 1,
              },
              {
                boundingBox: [5.3817, 2.3951, 5.8347, 2.3951, 5.8347, 2.4859, 5.3817, 2.4859],
                label: 'ocr text',
                value: 'America',
                confidence: 1,
              },
            ],
          },
          {
            number: 32,
            words: [
              {
                boundingBox: [1.0682, 2.5428, 1.2655, 2.5428, 1.2655, 2.6342, 1.0682, 2.6342],
                label: 'ocr text',
                value: '300',
                confidence: 1,
              },
              {
                boundingBox: [1.3076, 2.5432, 1.6447, 2.5432, 1.6447, 2.6341, 1.3076, 2.6341],
                label: 'ocr text',
                value: 'Welsh',
                confidence: 1,
              },
              {
                boundingBox: [1.6977, 2.5432, 1.9776, 2.5432, 1.9776, 2.6341, 1.6977, 2.6341],
                label: 'ocr text',
                value: 'Road',
                confidence: 1,
              },
            ],
          },
          {
            number: 33,
            words: [
              {
                boundingBox: [4.769, 2.5428, 4.9663, 2.5428, 4.9663, 2.6342, 4.769, 2.6342],
                label: 'ocr text',
                value: '300',
                confidence: 1,
              },
              {
                boundingBox: [5.0084, 2.5432, 5.3455, 2.5432, 5.3455, 2.6341, 5.0084, 2.6341],
                label: 'ocr text',
                value: 'Welsh',
                confidence: 1,
              },
              {
                boundingBox: [5.3985, 2.5432, 5.6784, 2.5432, 5.6784, 2.6341, 5.3985, 2.6341],
                label: 'ocr text',
                value: 'Road',
                confidence: 1,
              },
            ],
          },
          {
            number: 34,
            words: [
              {
                boundingBox: [1.0711, 2.6914, 1.4854, 2.6914, 1.4854, 2.807, 1.0711, 2.807],
                label: 'ocr text',
                value: 'building',
                confidence: 1,
              },
              {
                boundingBox: [1.5336, 2.6926, 1.5929, 2.6926, 1.5929, 2.7822, 1.5336, 2.7822],
                label: 'ocr text',
                value: '5',
                confidence: 1,
              },
            ],
          },
          {
            number: 35,
            words: [
              {
                boundingBox: [4.7729, 2.6914, 5.1999, 2.6914, 5.1999, 2.807, 4.7729, 2.807],
                label: 'ocr text',
                value: 'Building',
                confidence: 1,
              },
              {
                boundingBox: [5.2445, 2.6914, 5.336, 2.6914, 5.336, 2.7985, 5.2445, 2.7985],
                label: 'ocr text',
                value: '4,',
                confidence: 1,
              },
              {
                boundingBox: [5.3873, 2.6899, 5.6612, 2.6899, 5.6612, 2.7822, 5.3873, 2.7822],
                label: 'ocr text',
                value: 'Suite',
                confidence: 1,
              },
              {
                boundingBox: [5.7045, 2.691, 5.9034, 2.691, 5.9034, 2.7822, 5.7045, 2.7822],
                label: 'ocr text',
                value: '200',
                confidence: 1,
              },
            ],
          },
          {
            number: 36,
            words: [
              {
                boundingBox: [1.073, 2.8395, 1.5936, 2.8395, 1.5936, 2.9466, 1.073, 2.9466],
                label: 'ocr text',
                value: 'Horsham,',
                confidence: 1,
              },
              {
                boundingBox: [1.6489, 2.8395, 1.806, 2.8395, 1.806, 2.929, 1.6489, 2.929],
                label: 'ocr text',
                value: 'PA',
                confidence: 1,
              },
              {
                boundingBox: [1.854, 2.8391, 2.1819, 2.8391, 2.1819, 2.9304, 1.854, 2.9304],
                label: 'ocr text',
                value: '19044',
                confidence: 1,
              },
            ],
          },
          {
            number: 37,
            words: [
              {
                boundingBox: [4.7738, 2.8395, 5.2944, 2.8395, 5.2944, 2.9466, 4.7738, 2.9466],
                label: 'ocr text',
                value: 'Horsham,',
                confidence: 1,
              },
              {
                boundingBox: [5.3497, 2.8395, 5.5068, 2.8395, 5.5068, 2.929, 5.3497, 2.929],
                label: 'ocr text',
                value: 'PA',
                confidence: 1,
              },
              {
                boundingBox: [5.5548, 2.8391, 5.8827, 2.8391, 5.8827, 2.9304, 5.5548, 2.9304],
                label: 'ocr text',
                value: '19044',
                confidence: 1,
              },
            ],
          },
          {
            number: 38,
            words: [
              {
                boundingBox: [1.0729, 2.9862, 1.32, 2.9862, 1.32, 3.0785, 1.0729, 3.0785],
                label: 'ocr text',
                value: 'USA',
                confidence: 1,
              },
            ],
          },
          {
            number: 39,
            words: [
              {
                boundingBox: [4.7737, 2.9862, 5.0208, 2.9862, 5.0208, 3.0785, 4.7737, 3.0785],
                label: 'ocr text',
                value: 'USA',
                confidence: 1,
              },
            ],
          },
          {
            number: 40,
            words: [
              {
                boundingBox: [4.774, 3.1343, 6.381, 3.1343, 6.381, 3.2268, 4.774, 3.2268],
                label: 'ocr text',
                value: 'FAH-20201130-96112-4/Mac',
                confidence: 1,
              },
              {
                boundingBox: [6.4183, 3.1358, 6.7207, 3.1358, 6.7207, 3.2514, 6.4183, 3.2514],
                label: 'ocr text',
                value: 'Wiggi',
                confidence: 1,
              },
            ],
          },
          {
            number: 41,
            words: [
              {
                boundingBox: [0.5962, 3.3218, 0.9012, 3.3218, 0.9012, 3.4142, 0.5962, 3.4142],
                label: 'ocr text',
                value: 'Serial',
                confidence: 1,
              },
              {
                boundingBox: [0.9458, 3.3218, 1.0378, 3.3218, 1.0378, 3.4142, 0.9458, 3.4142],
                label: 'ocr text',
                value: '#:',
                confidence: 1,
              },
              {
                boundingBox: [1.0849, 3.323, 1.6262, 3.323, 1.6262, 3.4143, 1.0849, 3.4143],
                label: 'ocr text',
                value: '4RZDK53',
                confidence: 1,
              },
            ],
          },
          {
            number: 42,
            words: [
              {
                boundingBox: [0.5962, 3.47, 0.9012, 3.47, 0.9012, 3.5624, 0.5962, 3.5624],
                label: 'ocr text',
                value: 'Serial',
                confidence: 1,
              },
              {
                boundingBox: [0.9458, 3.47, 1.0378, 3.47, 1.0378, 3.5624, 0.9458, 3.5624],
                label: 'ocr text',
                value: '#:',
                confidence: 1,
              },
              {
                boundingBox: [1.0849, 3.4711, 1.6192, 3.4711, 1.6192, 3.5625, 1.0849, 3.5625],
                label: 'ocr text',
                value: '4XZDK53',
                confidence: 1,
              },
            ],
          },
          {
            number: 43,
            words: [
              {
                boundingBox: [0.5962, 3.6182, 0.9012, 3.6182, 0.9012, 3.7105, 0.5962, 3.7105],
                label: 'ocr text',
                value: 'Serial',
                confidence: 1,
              },
              {
                boundingBox: [0.9458, 3.6182, 1.0378, 3.6182, 1.0378, 3.7105, 0.9458, 3.7105],
                label: 'ocr text',
                value: '#:',
                confidence: 1,
              },
              {
                boundingBox: [1.0849, 3.6193, 1.6054, 3.6193, 1.6054, 3.7107, 1.0849, 3.7107],
                label: 'ocr text',
                value: '47ZDK53',
                confidence: 1,
              },
            ],
          },
          {
            number: 44,
            words: [
              {
                boundingBox: [0.5962, 3.7663, 0.9012, 3.7663, 0.9012, 3.8587, 0.5962, 3.8587],
                label: 'ocr text',
                value: 'Serial',
                confidence: 1,
              },
              {
                boundingBox: [0.9458, 3.7663, 1.0378, 3.7663, 1.0378, 3.8587, 0.9458, 3.8587],
                label: 'ocr text',
                value: '#:',
                confidence: 1,
              },
              {
                boundingBox: [1.0886, 3.7674, 1.6122, 3.7674, 1.6122, 3.8588, 1.0886, 3.8588],
                label: 'ocr text',
                value: '5FZDK53',
                confidence: 1,
              },
            ],
          },
          {
            number: 45,
            words: [
              {
                boundingBox: [0.5962, 3.9145, 0.9012, 3.9145, 0.9012, 4.0068, 0.5962, 4.0068],
                label: 'ocr text',
                value: 'Serial',
                confidence: 1,
              },
              {
                boundingBox: [0.9458, 3.9145, 1.0378, 3.9145, 1.0378, 4.0068, 0.9458, 4.0068],
                label: 'ocr text',
                value: '#:',
                confidence: 1,
              },
              {
                boundingBox: [1.0886, 3.9156, 1.6054, 3.9156, 1.6054, 4.007, 1.0886, 4.007],
                label: 'ocr text',
                value: '5H1FK53',
                confidence: 1,
              },
            ],
          },
          {
            number: 46,
            words: [
              {
                boundingBox: [0.5962, 4.0626, 0.9012, 4.0626, 0.9012, 4.155, 0.5962, 4.155],
                label: 'ocr text',
                value: 'Serial',
                confidence: 1,
              },
              {
                boundingBox: [0.9458, 4.0626, 1.0378, 4.0626, 1.0378, 4.155, 0.9458, 4.155],
                label: 'ocr text',
                value: '#:',
                confidence: 1,
              },
              {
                boundingBox: [1.0886, 4.0637, 1.6054, 4.0637, 1.6054, 4.1551, 1.0886, 4.1551],
                label: 'ocr text',
                value: '57ZDK53',
                confidence: 1,
              },
            ],
          },
          {
            number: 47,
            words: [
              {
                boundingBox: [0.5962, 4.2108, 0.9012, 4.2108, 0.9012, 4.3031, 0.5962, 4.3031],
                label: 'ocr text',
                value: 'Serial',
                confidence: 1,
              },
              {
                boundingBox: [0.9458, 4.2108, 1.0378, 4.2108, 1.0378, 4.3031, 0.9458, 4.3031],
                label: 'ocr text',
                value: '#:',
                confidence: 1,
              },
              {
                boundingBox: [1.0881, 4.2119, 1.6608, 4.2119, 1.6608, 4.3033, 1.0881, 4.3033],
                label: 'ocr text',
                value: '6WYDK53',
                confidence: 1,
              },
            ],
          },
          {
            number: 48,
            words: [
              {
                boundingBox: [0.5962, 4.3589, 0.9012, 4.3589, 0.9012, 4.4513, 0.5962, 4.4513],
                label: 'ocr text',
                value: 'Serial',
                confidence: 1,
              },
              {
                boundingBox: [0.9458, 4.3589, 1.0378, 4.3589, 1.0378, 4.4513, 0.9458, 4.4513],
                label: 'ocr text',
                value: '#:',
                confidence: 1,
              },
              {
                boundingBox: [1.0881, 4.36, 1.6054, 4.36, 1.6054, 4.4514, 1.0881, 4.4514],
                label: 'ocr text',
                value: '68ZDK53',
                confidence: 1,
              },
            ],
          },
          {
            number: 49,
            words: [
              {
                boundingBox: [0.5962, 4.5071, 0.9012, 4.5071, 0.9012, 4.5994, 0.5962, 4.5994],
                label: 'ocr text',
                value: 'Serial',
                confidence: 1,
              },
              {
                boundingBox: [0.9458, 4.5071, 1.0378, 4.5071, 1.0378, 4.5994, 0.9458, 4.5994],
                label: 'ocr text',
                value: '#:',
                confidence: 1,
              },
              {
                boundingBox: [1.0892, 4.5082, 1.6608, 4.5082, 1.6608, 4.5996, 1.0892, 4.5996],
                label: 'ocr text',
                value: '7WYDK53',
                confidence: 1,
              },
            ],
          },
          {
            number: 50,
            words: [
              {
                boundingBox: [0.5962, 4.6552, 0.9012, 4.6552, 0.9012, 4.7476, 0.5962, 4.7476],
                label: 'ocr text',
                value: 'Serial',
                confidence: 1,
              },
              {
                boundingBox: [0.9458, 4.6552, 1.0378, 4.6552, 1.0378, 4.7476, 0.9458, 4.7476],
                label: 'ocr text',
                value: '#:',
                confidence: 1,
              },
              {
                boundingBox: [1.0884, 4.6563, 1.6608, 4.6563, 1.6608, 4.7477, 1.0884, 4.7477],
                label: 'ocr text',
                value: '8WYDK53',
                confidence: 1,
              },
            ],
          },
          {
            number: 51,
            words: [
              {
                boundingBox: [0.5962, 4.8034, 0.9012, 4.8034, 0.9012, 4.8957, 0.5962, 4.8957],
                label: 'ocr text',
                value: 'Serial',
                confidence: 1,
              },
              {
                boundingBox: [0.9458, 4.8034, 1.0378, 4.8034, 1.0378, 4.8957, 0.9458, 4.8957],
                label: 'ocr text',
                value: '#:',
                confidence: 1,
              },
              {
                boundingBox: [1.0886, 4.8045, 1.5914, 4.8045, 1.5914, 4.8959, 1.0886, 4.8959],
                label: 'ocr text',
                value: '9T0FK53',
                confidence: 1,
              },
            ],
          },
          {
            number: 52,
            words: [
              {
                boundingBox: [0.5962, 4.9515, 0.9012, 4.9515, 0.9012, 5.0439, 0.5962, 5.0439],
                label: 'ocr text',
                value: 'Serial',
                confidence: 1,
              },
              {
                boundingBox: [0.9458, 4.9515, 1.0378, 4.9515, 1.0378, 5.0439, 0.9458, 5.0439],
                label: 'ocr text',
                value: '#:',
                confidence: 1,
              },
              {
                boundingBox: [1.0886, 4.9526, 1.6608, 4.9526, 1.6608, 5.044, 1.0886, 5.044],
                label: 'ocr text',
                value: '9WYDK53',
                confidence: 1,
              },
            ],
          },
          {
            number: 53,
            words: [
              {
                boundingBox: [0.5962, 5.0997, 0.9012, 5.0997, 0.9012, 5.192, 0.5962, 5.192],
                label: 'ocr text',
                value: 'Serial',
                confidence: 1,
              },
              {
                boundingBox: [0.9458, 5.0997, 1.0378, 5.0997, 1.0378, 5.192, 0.9458, 5.192],
                label: 'ocr text',
                value: '#:',
                confidence: 1,
              },
              {
                boundingBox: [1.0886, 5.1008, 1.6054, 5.1008, 1.6054, 5.1922, 1.0886, 5.1922],
                label: 'ocr text',
                value: '90ZDK53',
                confidence: 1,
              },
            ],
          },
          {
            number: 54,
            words: [
              {
                boundingBox: [4.9269, 8.4861, 5.2289, 8.4861, 5.2289, 8.5784, 4.9269, 8.5784],
                label: 'ocr text',
                value: 'Sales',
                confidence: 1,
              },
              {
                boundingBox: [5.2775, 8.4876, 5.7148, 8.4876, 5.7148, 8.5784, 5.2775, 8.5784],
                label: 'ocr text',
                value: 'Balance',
                confidence: 1,
              },
            ],
          },
          {
            number: 55,
            words: [
              {
                boundingBox: [7.0641, 8.4872, 7.5392, 8.4872, 7.5392, 8.5947, 7.0641, 8.5947],
                label: 'ocr text',
                value: '8,080.50',
                confidence: 1,
              },
            ],
          },
          {
            number: 56,
            words: [
              {
                boundingBox: [4.9315, 8.6844, 5.3093, 8.6844, 5.3093, 8.8, 4.9315, 8.8],
                label: 'ocr text',
                value: 'Freight',
                confidence: 1,
              },
            ],
          },
          {
            number: 57,
            words: [
              {
                boundingBox: [7.2946, 8.684, 7.5265, 8.684, 7.5265, 8.7753, 7.2946, 8.7753],
                label: 'ocr text',
                value: '0.00',
                confidence: 1,
              },
            ],
          },
          {
            number: 58,
            words: [
              {
                boundingBox: [4.9311, 8.8813, 5.4546, 8.8813, 5.4546, 8.9969, 4.9311, 8.9969],
                label: 'ocr text',
                value: 'Recycling',
                confidence: 1,
              },
              {
                boundingBox: [5.5079, 8.8813, 5.7078, 8.8813, 5.7078, 8.9721, 5.5079, 8.9721],
                label: 'ocr text',
                value: 'Fee',
                confidence: 1,
              },
            ],
          },
          {
            number: 59,
            words: [
              {
                boundingBox: [7.2946, 8.8809, 7.5265, 8.8809, 7.5265, 8.9721, 7.2946, 8.9721],
                label: 'ocr text',
                value: '0.00',
                confidence: 1,
              },
            ],
          },
          {
            number: 60,
            words: [
              {
                boundingBox: [4.9269, 9.0766, 5.2289, 9.0766, 5.2289, 9.169, 4.9269, 9.169],
                label: 'ocr text',
                value: 'Sales',
                confidence: 1,
              },
              {
                boundingBox: [5.2713, 9.0781, 5.4758, 9.0781, 5.4758, 9.169, 5.2713, 9.169],
                label: 'ocr text',
                value: 'Tax',
                confidence: 1,
              },
            ],
          },
          {
            number: 61,
            words: [
              {
                boundingBox: [7.1555, 9.0777, 7.5304, 9.0777, 7.5304, 9.1691, 7.1555, 9.1691],
                label: 'ocr text',
                value: '484.83',
                confidence: 1,
              },
            ],
          },
          {
            number: 62,
            words: [
              {
                boundingBox: [4.923, 9.2747, 5.211, 9.2747, 5.211, 9.3661, 4.923, 9.3661],
                label: 'ocr text',
                value: 'Total',
                confidence: 1,
              },
            ],
          },
          {
            number: 63,
            words: [
              {
                boundingBox: [7.063, 9.2747, 7.5402, 9.2747, 7.5402, 9.3853, 7.063, 9.3853],
                label: 'ocr text',
                value: '8,565.33',
                confidence: 1,
              },
            ],
          },
          {
            number: 64,
            words: [
              {
                boundingBox: [4.9268, 9.4692, 5.4676, 9.4692, 5.4676, 9.5879, 4.9268, 9.5879],
                label: 'ocr text',
                value: 'Currency',
                confidence: 1,
              },
            ],
          },
          {
            number: 65,
            words: [
              {
                boundingBox: [7.2875, 9.4692, 7.5377, 9.4692, 7.5377, 9.5636, 7.2875, 9.5636],
                label: 'ocr text',
                value: 'USD',
                confidence: 1,
              },
            ],
          },
          {
            number: 66,
            words: [
              {
                boundingBox: [0.5758, 9.8773, 0.671, 9.8818, 0.671, 9.9589, 0.5804, 9.9544],
                label: 'ocr text',
                value: 'We',
                confidence: 0.988,
              },
              {
                boundingBox: [0.6846, 9.8818, 0.8751, 9.8818, 0.8751, 9.9589, 0.6846, 9.9589],
                label: 'ocr text',
                value: 'report',
                confidence: 0.985,
              },
              {
                boundingBox: [0.8887, 9.8818, 0.9794, 9.8773, 0.9748, 9.9589, 0.8887, 9.9589],
                label: 'ocr text',
                value: 'to',
                confidence: 0.988,
              },
            ],
          },
          {
            number: 67,
            words: [
              {
                boundingBox: [0.3582, 9.9997, 0.5214, 9.9952, 0.5214, 10.1176, 0.3582, 10.1176],
                label: 'ocr text',
                value: 'dun',
                confidence: 0.986,
              },
              {
                boundingBox: [0.5486, 9.9952, 0.6257, 9.9907, 0.6257, 10.1176, 0.5486, 10.1176],
                label: 'ocr text',
                value: '&',
                confidence: 0.985,
              },
              {
                boundingBox: [0.6484, 9.9907, 1.2197, 9.9997, 1.2197, 10.1131, 0.6484, 10.1176],
                label: 'ocr text',
                value: 'bradstreet',
                confidence: 0.981,
              },
            ],
          },
          {
            number: 68,
            words: [
              {
                boundingBox: [0.2403, 10.1539, 0.2992, 10.1539, 0.2992, 10.2265, 0.2403, 10.2265],
                label: 'ocr text',
                value: 'to',
                confidence: 0.988,
              },
              {
                boundingBox: [0.3128, 10.1539, 0.4942, 10.1539, 0.4942, 10.231, 0.3128, 10.2265],
                label: 'ocr text',
                value: 'better',
                confidence: 0.985,
              },
              {
                boundingBox: [0.5078, 10.1539, 0.6756, 10.1539, 0.671, 10.231, 0.5078, 10.231],
                label: 'ocr text',
                value: 'serve',
                confidence: 0.986,
              },
              {
                boundingBox: [0.6892, 10.1539, 0.7889, 10.1539, 0.7889, 10.231, 0.6846, 10.231],
                label: 'ocr text',
                value: 'the',
                confidence: 0.987,
              },
              {
                boundingBox: [0.8025, 10.1539, 0.9794, 10.1539, 0.9748, 10.231, 0.8025, 10.231],
                label: 'ocr text',
                value: 'credit',
                confidence: 0.985,
              },
              {
                boundingBox: [0.993, 10.1539, 1.3375, 10.1539, 1.3375, 10.231, 0.9884, 10.231],
                label: 'ocr text',
                value: 'community',
                confidence: 0.983,
              },
            ],
          },
          {
            number: 69,
            words: [
              {
                boundingBox: [0.6348, 10.2492, 0.934, 10.2492, 0.934, 10.299, 0.6348, 10.299],
                label: 'ocr text',
                value: 'www.dnb.com',
                confidence: 0.975,
              },
            ],
          },
          {
            number: 70,
            words: [
              {
                boundingBox: [6.8206, 10.2592, 7.0976, 10.2592, 7.0976, 10.3748, 6.8206, 10.3748],
                label: 'ocr text',
                value: 'Page',
                confidence: 1,
              },
              {
                boundingBox: [7.1756, 10.2588, 7.2349, 10.2588, 7.2349, 10.3487, 7.1756, 10.3487],
                label: 'ocr text',
                value: '2',
                confidence: 1,
              },
              {
                boundingBox: [7.3149, 10.2577, 7.4194, 10.2577, 7.4194, 10.3501, 7.3149, 10.3501],
                label: 'ocr text',
                value: 'of',
                confidence: 1,
              },
              {
                boundingBox: [7.4878, 10.2588, 7.547, 10.2588, 7.547, 10.3487, 7.4878, 10.3487],
                label: 'ocr text',
                value: '2',
                confidence: 1,
              },
            ],
          },
        ],
      },
    ],
    documentId: 'B9D37260-FB5D-498C-B582-AD9F02CFCCE8',
    fileId: '100008306.pdf',
    dateReceived: '2020-09-01T18:48:52.037Z',
  },
  userLock: {
    id: null,
    documentId: 'B9D37260-FB5D-498C-B582-AD9F02CFCCE8',
    indexer: 'avidtest@avidxchange.com',
    startTime: '2021-01-20T14:18:05.4541182Z',
  },
};
