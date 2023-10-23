import {
  getCompositeDataStub,
  getFieldBaseStub,
  getIndexedLabelStub,
} from '@ui-coe/avidcapture/shared/test';
import { DocumentLabelKeys, DocumentTypes, InvoiceTypes } from '@ui-coe/avidcapture/shared/types';

import { ActivityLogDisplayLabelPipe } from './activity-log-display-label.pipe';

describe('ActivityLogDisplayLabelPipe', () => {
  const storeStub = {
    selectSnapshot: jest.fn(),
  } as any;

  const pipe = new ActivityLogDisplayLabelPipe(storeStub);

  afterEach(() => jest.clearAllMocks());

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  describe('for non lookup fields', () => {
    describe('when label is non lookup, DisplayPredictedValues is ON, initialNonLookupCheck is TRUE, & confidence is higher than display threshold', () => {
      let expectedValue: boolean;
      const displayPredictedValuesLbl = getIndexedLabelStub(
        DocumentLabelKeys.nonLookupLabels.DisplayPredictedValues
      );
      const label = getIndexedLabelStub(DocumentLabelKeys.nonLookupLabels.InvoiceNumber);
      const fieldBaseStub = [getFieldBaseStub(DocumentLabelKeys.nonLookupLabels.InvoiceNumber)];
      const compositeData = getCompositeDataStub();

      displayPredictedValuesLbl.value.text = '1';
      label.value.confidence = 0.99;
      fieldBaseStub[0].displayThreshold.view = 80;
      compositeData.indexed.labels.push(displayPredictedValuesLbl);

      beforeEach(() => {
        storeStub.selectSnapshot
          .mockImplementationOnce(cb =>
            cb({
              indexingPage: {
                compositeData,
              },
            })
          )
          .mockImplementationOnce(cb =>
            cb({
              indexingDocumentFields: {
                formFields: fieldBaseStub,
              },
            })
          );

        expectedValue = pipe.transform(label, true, true, DocumentTypes.Indexing);
      });

      it('should return true', () => {
        expect(expectedValue).toBeTruthy();
      });
    });

    describe('when DisplayPredictedValues is ON but initialNonLookupCheck is FALSE', () => {
      let expectedValue: boolean;
      const displayPredictedValuesLbl = getIndexedLabelStub(
        DocumentLabelKeys.nonLookupLabels.DisplayPredictedValues
      );
      const label = getIndexedLabelStub(DocumentLabelKeys.nonLookupLabels.InvoiceNumber);
      const fieldBaseStub = [getFieldBaseStub(DocumentLabelKeys.nonLookupLabels.InvoiceNumber)];
      const compositeData = getCompositeDataStub();

      displayPredictedValuesLbl.value.text = '1';
      label.value.confidence = 0.99;
      fieldBaseStub[0].displayThreshold.view = 80;
      compositeData.indexed.labels.push(displayPredictedValuesLbl);

      beforeEach(() => {
        storeStub.selectSnapshot
          .mockImplementationOnce(cb =>
            cb({
              indexingPage: {
                compositeData,
              },
            })
          )
          .mockImplementationOnce(cb =>
            cb({
              indexingDocumentFields: {
                formFields: fieldBaseStub,
              },
            })
          );

        expectedValue = pipe.transform(label, false, false, DocumentTypes.Indexing);
      });

      it('should return false', () => {
        expect(expectedValue).toBeFalsy();
      });
    });

    describe('when DisplayPredictedValues is OFF', () => {
      let expectedValue: boolean;
      const displayPredictedValuesLbl = getIndexedLabelStub(
        DocumentLabelKeys.nonLookupLabels.DisplayPredictedValues
      );
      const label = getIndexedLabelStub(DocumentLabelKeys.nonLookupLabels.InvoiceNumber);
      const fieldBaseStub = [getFieldBaseStub(DocumentLabelKeys.nonLookupLabels.InvoiceNumber)];
      const compositeData = getCompositeDataStub();

      displayPredictedValuesLbl.value.text = '0';
      label.value.confidence = 0.99;
      fieldBaseStub[0].displayThreshold.view = 80;
      compositeData.indexed.labels.push(displayPredictedValuesLbl);

      beforeEach(() => {
        storeStub.selectSnapshot
          .mockImplementationOnce(cb =>
            cb({
              indexingPage: {
                compositeData,
              },
            })
          )
          .mockImplementationOnce(cb =>
            cb({
              indexingDocumentFields: {
                formFields: fieldBaseStub,
              },
            })
          );

        expectedValue = pipe.transform(label, false, false, DocumentTypes.Indexing);
      });

      it('should return false', () => {
        expect(expectedValue).toBeFalsy();
      });
    });

    describe('when DisplayPredictedValues label is OFF but user is a Sponsor User', () => {
      let expectedValue: boolean;
      const displayPredictedValuesLbl = getIndexedLabelStub(
        DocumentLabelKeys.nonLookupLabels.DisplayPredictedValues
      );
      const label = getIndexedLabelStub(DocumentLabelKeys.nonLookupLabels.InvoiceNumber);
      const fieldBaseStub = [getFieldBaseStub(DocumentLabelKeys.nonLookupLabels.InvoiceNumber)];
      const compositeData = getCompositeDataStub();

      displayPredictedValuesLbl.value.text = '0';
      label.value.confidence = 0.99;
      fieldBaseStub[0].displayThreshold.view = 80;
      compositeData.indexed.labels.push(displayPredictedValuesLbl);

      beforeEach(() => {
        storeStub.selectSnapshot
          .mockImplementationOnce(cb =>
            cb({
              indexingPage: {
                compositeData,
              },
            })
          )
          .mockImplementationOnce(cb =>
            cb({
              indexingDocumentFields: {
                formFields: fieldBaseStub,
              },
            })
          );

        expectedValue = pipe.transform(label, true, true, DocumentTypes.Indexing);
      });

      it('should return false', () => {
        expect(expectedValue).toBeFalsy();
      });
    });

    describe('when DisplayPredictedValues label is OFF but label confidence is greater than or equal to label threshold', () => {
      let expectedValue: boolean;
      const displayPredictedValuesLbl = getIndexedLabelStub(
        DocumentLabelKeys.nonLookupLabels.DisplayPredictedValues
      );
      const label = getIndexedLabelStub(DocumentLabelKeys.nonLookupLabels.InvoiceNumber);
      const fieldBaseStub = [getFieldBaseStub(DocumentLabelKeys.nonLookupLabels.InvoiceNumber)];
      const compositeData = getCompositeDataStub();

      displayPredictedValuesLbl.value.text = '0';
      label.value.confidence = 0.99;
      fieldBaseStub[0].displayThreshold.view = 80;
      compositeData.indexed.labels.push(displayPredictedValuesLbl);

      beforeEach(() => {
        storeStub.selectSnapshot
          .mockImplementationOnce(cb =>
            cb({
              indexingPage: {
                compositeData,
              },
            })
          )
          .mockImplementationOnce(cb =>
            cb({
              indexingDocumentFields: {
                formFields: fieldBaseStub,
              },
            })
          );

        expectedValue = pipe.transform(label, true, true, DocumentTypes.Indexing);
      });

      it('should return false', () => {
        expect(expectedValue).toBeFalsy();
      });
    });

    describe('when DisplayPredictedValues label is OFF && label confidence is less than label threshold', () => {
      let expectedValue: boolean;
      const displayPredictedValuesLbl = getIndexedLabelStub(
        DocumentLabelKeys.nonLookupLabels.DisplayPredictedValues
      );
      const label = getIndexedLabelStub(DocumentLabelKeys.nonLookupLabels.InvoiceNumber);
      const fieldBaseStub = [getFieldBaseStub(DocumentLabelKeys.nonLookupLabels.InvoiceNumber)];
      const compositeData = getCompositeDataStub();

      displayPredictedValuesLbl.value.text = '0';
      label.value.confidence = 0.5;
      fieldBaseStub[0].displayThreshold.view = 100;
      compositeData.indexed.labels.push(displayPredictedValuesLbl);

      beforeEach(() => {
        storeStub.selectSnapshot
          .mockImplementationOnce(cb =>
            cb({
              indexingPage: {
                compositeData,
              },
            })
          )
          .mockImplementationOnce(cb =>
            cb({
              indexingDocumentFields: {
                formFields: fieldBaseStub,
              },
            })
          );

        expectedValue = pipe.transform(label, true, true, DocumentTypes.Indexing);
      });

      it('should return false', () => {
        expect(expectedValue).toBeFalsy();
      });
    });

    describe('when DisplayPredictedValues label is not found && is NOT a Sponsor User && confidence is below threshold', () => {
      let expectedValue: boolean;
      const label = getIndexedLabelStub(DocumentLabelKeys.nonLookupLabels.InvoiceNumber);
      const fieldBaseStub = [getFieldBaseStub(DocumentLabelKeys.nonLookupLabels.InvoiceNumber)];
      const compositeData = getCompositeDataStub();

      label.value.confidence = 0.5;
      fieldBaseStub[0].displayThreshold.view = 80;

      beforeEach(() => {
        storeStub.selectSnapshot
          .mockImplementationOnce(cb =>
            cb({
              indexingPage: {
                compositeData,
              },
            })
          )
          .mockImplementationOnce(cb =>
            cb({
              indexingDocumentFields: {
                formFields: fieldBaseStub,
              },
            })
          );

        expectedValue = pipe.transform(label, false, false, DocumentTypes.Indexing);
      });

      it('should return false', () => {
        expect(expectedValue).toBeFalsy();
      });
    });
  });

  describe('for lookup fields', () => {
    describe('when all lookup field checks are TRUE', () => {
      let expectedValue: boolean;
      const displayPredictedValuesLbl = getIndexedLabelStub(
        DocumentLabelKeys.nonLookupLabels.DisplayPredictedValues
      );
      const displayIdentifierSearchValuesLbl = getIndexedLabelStub(
        DocumentLabelKeys.nonLookupLabels.DisplayIdentifierSearchValues
      );
      const label = getIndexedLabelStub(DocumentLabelKeys.lookupLabels.CustomerAccountNumber);
      const fieldBaseStub = [
        getFieldBaseStub(DocumentLabelKeys.lookupLabels.CustomerAccountNumber),
      ];
      const compositeData = getCompositeDataStub();

      displayPredictedValuesLbl.value.text = '1';
      displayIdentifierSearchValuesLbl.value.text = '1';
      label.value.confidence = 0.99;
      fieldBaseStub[0].displayThreshold.view = 80;
      compositeData.indexed.labels.push(
        displayPredictedValuesLbl,
        displayIdentifierSearchValuesLbl
      );

      beforeEach(() => {
        storeStub.selectSnapshot
          .mockImplementationOnce(cb =>
            cb({
              indexingPage: {
                compositeData,
              },
            })
          )
          .mockImplementationOnce(cb =>
            cb({
              indexingDocumentFields: {
                formFields: fieldBaseStub,
              },
            })
          );

        expectedValue = pipe.transform(label, true, true, DocumentTypes.Indexing);
      });

      it('should return true', () => {
        expect(expectedValue).toBeTruthy();
      });
    });

    describe('when DisplayIdentifierSearchValues is OFF', () => {
      let expectedValue: boolean;
      const displayPredictedValuesLbl = getIndexedLabelStub(
        DocumentLabelKeys.nonLookupLabels.DisplayPredictedValues
      );
      const displayIdentifierSearchValuesLbl = getIndexedLabelStub(
        DocumentLabelKeys.nonLookupLabels.DisplayIdentifierSearchValues
      );
      const label = getIndexedLabelStub(DocumentLabelKeys.lookupLabels.CustomerAccountNumber);
      const fieldBaseStub = [
        getFieldBaseStub(DocumentLabelKeys.lookupLabels.CustomerAccountNumber),
      ];
      const compositeData = getCompositeDataStub();

      displayPredictedValuesLbl.value.text = '1';
      displayIdentifierSearchValuesLbl.value.text = '0';
      label.value.confidence = 0.99;
      fieldBaseStub[0].displayThreshold.view = 80;
      compositeData.indexed.labels.push(
        displayPredictedValuesLbl,
        displayIdentifierSearchValuesLbl
      );

      beforeEach(() => {
        storeStub.selectSnapshot
          .mockImplementationOnce(cb =>
            cb({
              indexingPage: {
                compositeData,
              },
            })
          )
          .mockImplementationOnce(cb =>
            cb({
              indexingDocumentFields: {
                formFields: fieldBaseStub,
              },
            })
          );

        expectedValue = pipe.transform(label, true, true, DocumentTypes.Indexing);
      });

      it('should return false', () => {
        expect(expectedValue).toBeFalsy();
      });
    });

    describe('when DisplayPredictedValues is ON but initialLookupFieldCheck is FALSE', () => {
      let expectedValue: boolean;
      const displayPredictedValuesLbl = getIndexedLabelStub(
        DocumentLabelKeys.nonLookupLabels.DisplayPredictedValues
      );
      const displayIdentifierSearchValuesLbl = getIndexedLabelStub(
        DocumentLabelKeys.nonLookupLabels.DisplayIdentifierSearchValues
      );
      const label = getIndexedLabelStub(DocumentLabelKeys.lookupLabels.CustomerAccountNumber);
      const fieldBaseStub = [
        getFieldBaseStub(DocumentLabelKeys.lookupLabels.CustomerAccountNumber),
      ];
      const compositeData = getCompositeDataStub();

      displayPredictedValuesLbl.value.text = '1';
      displayIdentifierSearchValuesLbl.value.text = '1';
      label.value.confidence = 0.99;
      fieldBaseStub[0].displayThreshold.view = 80;
      compositeData.indexed.labels.push(
        displayPredictedValuesLbl,
        displayIdentifierSearchValuesLbl
      );

      beforeEach(() => {
        storeStub.selectSnapshot
          .mockImplementationOnce(cb =>
            cb({
              indexingPage: {
                compositeData,
              },
            })
          )
          .mockImplementationOnce(cb =>
            cb({
              indexingDocumentFields: {
                formFields: fieldBaseStub,
              },
            })
          );

        expectedValue = pipe.transform(label, false, false, DocumentTypes.Indexing);
      });

      it('should return false', () => {
        expect(expectedValue).toBeFalsy();
      });
    });

    describe('when DisplayPredictedValues is OFF', () => {
      let expectedValue: boolean;
      const displayPredictedValuesLbl = getIndexedLabelStub(
        DocumentLabelKeys.nonLookupLabels.DisplayPredictedValues
      );
      const displayIdentifierSearchValuesLbl = getIndexedLabelStub(
        DocumentLabelKeys.nonLookupLabels.DisplayIdentifierSearchValues
      );
      const label = getIndexedLabelStub(DocumentLabelKeys.lookupLabels.CustomerAccountNumber);
      const fieldBaseStub = [
        getFieldBaseStub(DocumentLabelKeys.lookupLabels.CustomerAccountNumber),
      ];
      const compositeData = getCompositeDataStub();

      displayPredictedValuesLbl.value.text = '0';
      displayIdentifierSearchValuesLbl.value.text = '1';
      label.value.confidence = 0.99;
      fieldBaseStub[0].displayThreshold.view = 80;
      compositeData.indexed.labels.push(
        displayPredictedValuesLbl,
        displayIdentifierSearchValuesLbl
      );

      beforeEach(() => {
        storeStub.selectSnapshot
          .mockImplementationOnce(cb =>
            cb({
              indexingPage: {
                compositeData,
              },
            })
          )
          .mockImplementationOnce(cb =>
            cb({
              indexingDocumentFields: {
                formFields: fieldBaseStub,
              },
            })
          );

        expectedValue = pipe.transform(label, true, true, DocumentTypes.Indexing);
      });

      it('should return false', () => {
        expect(expectedValue).toBeFalsy();
      });
    });

    describe('when all checks are TRUE except for initialLookupFieldCheck', () => {
      let expectedValue: boolean;
      const displayPredictedValuesLbl = getIndexedLabelStub(
        DocumentLabelKeys.nonLookupLabels.DisplayPredictedValues
      );
      const displayIdentifierSearchValuesLbl = getIndexedLabelStub(
        DocumentLabelKeys.nonLookupLabels.DisplayIdentifierSearchValues
      );
      const label = getIndexedLabelStub(DocumentLabelKeys.lookupLabels.CustomerAccountNumber);
      const fieldBaseStub = [
        getFieldBaseStub(DocumentLabelKeys.lookupLabels.CustomerAccountNumber),
      ];
      const compositeData = getCompositeDataStub();

      displayPredictedValuesLbl.value.text = '1';
      displayIdentifierSearchValuesLbl.value.text = '1';
      label.value.confidence = 0.99;
      fieldBaseStub[0].displayThreshold.view = 80;
      compositeData.indexed.labels.push(
        displayPredictedValuesLbl,
        displayIdentifierSearchValuesLbl
      );

      beforeEach(() => {
        storeStub.selectSnapshot
          .mockImplementationOnce(cb =>
            cb({
              indexingPage: {
                compositeData,
              },
            })
          )
          .mockImplementationOnce(cb =>
            cb({
              indexingDocumentFields: {
                formFields: fieldBaseStub,
              },
            })
          );

        expectedValue = pipe.transform(label, false, true, DocumentTypes.Indexing);
      });

      it('should return false', () => {
        expect(expectedValue).toBeFalsy();
      });
    });
  });

  describe('when page is Archived', () => {
    describe('when all NonLookupField checks are TRUE', () => {
      let expectedValue: boolean;
      const displayPredictedValuesLbl = getIndexedLabelStub(
        DocumentLabelKeys.nonLookupLabels.DisplayPredictedValues
      );
      const label = getIndexedLabelStub(DocumentLabelKeys.nonLookupLabels.InvoiceNumber);
      const fieldBaseStub = [getFieldBaseStub(DocumentLabelKeys.nonLookupLabels.InvoiceNumber)];
      const compositeData = getCompositeDataStub();

      displayPredictedValuesLbl.value.text = '1';
      label.value.confidence = 0.99;
      fieldBaseStub[0].displayThreshold.view = 80;
      compositeData.indexed.labels.push(displayPredictedValuesLbl);

      beforeEach(() => {
        storeStub.selectSnapshot
          .mockImplementationOnce(cb =>
            cb({
              archiveInvoicePage: {
                document: compositeData,
              },
            })
          )
          .mockImplementationOnce(cb =>
            cb({
              archiveInvoicePage: {
                formFields: fieldBaseStub,
              },
            })
          );

        expectedValue = pipe.transform(label, true, true, DocumentTypes.Archived);
      });

      it('should return true', () => {
        expect(expectedValue).toBeTruthy();
      });
    });
  });

  describe('when field is a utility field', () => {
    describe('and canDisplayPredictedField returns true', () => {
      let expectedValue: boolean;
      const displayPredictedValuesLbl = getIndexedLabelStub(
        DocumentLabelKeys.nonLookupLabels.DisplayPredictedValues
      );
      const label = getIndexedLabelStub(DocumentLabelKeys.nonLookupLabels.ServiceStartDate);
      const fieldBaseStub = [getFieldBaseStub(DocumentLabelKeys.nonLookupLabels.ServiceStartDate)];
      const compositeData = getCompositeDataStub();

      displayPredictedValuesLbl.value.text = '1';
      label.value.confidence = 0.99;
      fieldBaseStub[0].displayThreshold.view = 80;
      compositeData.indexed.labels[0].value.text = InvoiceTypes.Utility;
      compositeData.indexed.labels.push(displayPredictedValuesLbl);

      beforeEach(() => {
        storeStub.selectSnapshot
          .mockImplementationOnce(cb =>
            cb({
              archiveInvoicePage: {
                document: compositeData,
              },
            })
          )
          .mockImplementationOnce(cb =>
            cb({
              archiveInvoicePage: {
                formFields: fieldBaseStub,
              },
            })
          );

        expectedValue = pipe.transform(label, true, true, DocumentTypes.Archived);
      });

      it('should return true', () => {
        expect(expectedValue).toBeTruthy();
      });
    });
  });

  describe('when label is apart of the Excluded Threshold check', () => {
    let expectedValue: boolean;
    const displayPredictedValuesLbl = getIndexedLabelStub(
      DocumentLabelKeys.nonLookupLabels.DisplayPredictedValues
    );
    const label = getIndexedLabelStub(DocumentLabelKeys.nonLookupLabels.SourceEmail);
    const fieldBaseStub = [getFieldBaseStub(DocumentLabelKeys.nonLookupLabels.SourceEmail)];
    const compositeData = getCompositeDataStub();

    displayPredictedValuesLbl.value.text = '1';
    label.value.confidence = 0.99;
    fieldBaseStub[0].displayThreshold.view = 80;
    compositeData.indexed.labels.push(displayPredictedValuesLbl);

    beforeEach(() => {
      storeStub.selectSnapshot
        .mockImplementationOnce(cb =>
          cb({
            archiveInvoicePage: {
              document: compositeData,
            },
          })
        )
        .mockImplementationOnce(cb =>
          cb({
            archiveInvoicePage: {
              formFields: fieldBaseStub,
            },
          })
        );

      expectedValue = pipe.transform(label, true, true, DocumentTypes.Archived);
    });

    it('should return true', () => {
      expect(expectedValue).toBeTruthy();
    });
  });

  describe('when compositeData for indexing page is NULL', () => {
    let expectedValue: boolean;
    const displayPredictedValuesLbl = getIndexedLabelStub(
      DocumentLabelKeys.nonLookupLabels.DisplayPredictedValues
    );
    const label = getIndexedLabelStub(DocumentLabelKeys.nonLookupLabels.InvoiceDate);
    const fieldBaseStub = [getFieldBaseStub(DocumentLabelKeys.nonLookupLabels.InvoiceDate)];
    const compositeData = getCompositeDataStub();

    displayPredictedValuesLbl.value.text = '1';
    label.value.confidence = 0.99;
    fieldBaseStub[0].displayThreshold.view = 80;
    compositeData.indexed.labels.push(displayPredictedValuesLbl);

    beforeEach(() => {
      storeStub.selectSnapshot
        .mockImplementationOnce(cb =>
          cb({
            indexingPage: {
              compositeData: null,
            },
          })
        )
        .mockImplementationOnce(cb =>
          cb({
            indexingDocumentFields: {
              formFields: null,
            },
          })
        );

      expectedValue = pipe.transform(label, true, true, DocumentTypes.Indexing);
    });

    it('should return false', () => {
      expect(expectedValue).toBeFalsy();
    });
  });

  describe('when compositeData for archived page is NULL', () => {
    let expectedValue: boolean;
    const displayPredictedValuesLbl = getIndexedLabelStub(
      DocumentLabelKeys.nonLookupLabels.DisplayPredictedValues
    );
    const label = getIndexedLabelStub(DocumentLabelKeys.nonLookupLabels.InvoiceDate);
    const fieldBaseStub = [getFieldBaseStub(DocumentLabelKeys.nonLookupLabels.InvoiceDate)];
    const compositeData = getCompositeDataStub();

    displayPredictedValuesLbl.value.text = '1';
    label.value.confidence = 0.99;
    fieldBaseStub[0].displayThreshold.view = 80;
    compositeData.indexed.labels.push(displayPredictedValuesLbl);

    beforeEach(() => {
      storeStub.selectSnapshot
        .mockImplementationOnce(cb =>
          cb({
            archiveInvoicePage: {
              document: null,
            },
          })
        )
        .mockImplementationOnce(cb =>
          cb({
            archiveInvoicePage: {
              formFields: null,
            },
          })
        );

      expectedValue = pipe.transform(label, true, true, DocumentTypes.Archived);
    });

    it('should return false', () => {
      expect(expectedValue).toBeFalsy();
    });
  });
});
