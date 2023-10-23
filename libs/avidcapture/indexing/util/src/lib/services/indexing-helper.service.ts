import { Injectable } from '@angular/core';
import {
  FormatterService,
  PageHelperService,
  ToastService,
  ValidatorService,
} from '@ui-coe/avidcapture/core/util';
import {
  Activity,
  ActivityTypes,
  AdvancedFiltersKeys,
  AppPages,
  ChangeLog,
  CompositeDocument,
  Document,
  DocumentLabelKeys,
  Escalation,
  EscalationCategoryTypes,
  FieldBase,
  IndexedData,
  IndexedLabel,
  IndexingPageAction,
  IngestionTypes,
  InputDataTypes,
  Integer,
  InvoiceTypes,
  LabelColor,
  LookupCustomerAccount,
  LookupPaymentTerms,
  SearchBodyRequest,
  SearchContext,
  SortDirection,
} from '@ui-coe/avidcapture/shared/types';
import { AssociationColors, documentLabelColors } from '@ui-coe/avidcapture/shared/util';
import { DateTime } from 'luxon';

@Injectable({
  providedIn: 'root',
})
export class IndexingHelperService {
  constructor(
    private toast: ToastService,
    private formatterService: FormatterService,
    private validatorService: ValidatorService,
    private pageHelperService: PageHelperService
  ) {}

  handleSaveSubmitSuccess(action: IndexingPageAction, fileName: string): void {
    let actionMessage = '';
    if (action == IndexingPageAction.Delete) {
      actionMessage = 'deleted';
    } else {
      actionMessage = IndexingPageAction.Save ? 'saved' : 'submitted';
    }

    const formattedDate = DateTime.local().toFormat('dd MMMM yyyy');
    const formattedTime = DateTime.local().toFormat('h:mma');
    const toastMessage = `Success! Invoice ${fileName}  posted on ${formattedDate} at ${formattedTime} has been ${actionMessage}.`;
    this.toast.success(toastMessage);
  }

  handleSaveSubmitError(action: IndexingPageAction): void {
    const toastMessage = `There was an issue ${action} this invoice.`;
    this.toast.error(toastMessage);
  }

  handleLookupError(): void {
    const toastMessage = `Error completing your request.`;
    this.toast.error(toastMessage);
  }

  handleInactiveShipTo(): void {
    const toastMessage = `Default Ship-To is Inactive.`;
    this.toast.warning(toastMessage);
  }

  handleDocSwapSubmission(fileName: string): void {
    this.toast.success(
      `${fileName} has been submitted for processing. The document will be available in the My Uploads queue when processing is complete.`
    );
  }

  handleNoMoreInvoices(): void {
    this.toast.warning('There are no more invoices to index.');
  }

  createLabelColors(indexedDocument: IndexedData): LabelColor[] {
    return indexedDocument.labels.reduce((acc, label) => {
      acc = documentLabelColors;
      if (this.needsColorLabel(label.label, documentLabelColors)) {
        const colorNumber = documentLabelColors.length % AssociationColors.colors.length;
        acc.push({
          labelName: label.label,
          color: AssociationColors.colors[colorNumber],
        });
      }
      return acc;
    }, []);
  }

  getIndexedLabel(labels: IndexedLabel[], labelName: string): IndexedLabel {
    return (
      labels.find(lbl => lbl.label === labelName) ?? {
        id: '00000000-0000-0000-0000-000000000000',
        label: labelName,
        page: 0,
        value: {
          boundingBox: [],
          confidence: 0,
          incomplete: false,
          incompleteReason: null,
          required: false,
          text: '',
          type: '',
          verificationState: 'NotRequired',
        },
      }
    );
  }

  assignValuesToFields(
    parsedFields: FieldBase<string>[],
    indexedDocument: IndexedData
  ): FieldBase<string>[] {
    indexedDocument.labels.forEach(label => {
      parsedFields.map((field: FieldBase<string>) => {
        const labelColor = documentLabelColors.find(lbl => lbl.labelName === field.key);

        field.headerBackgroundColor = labelColor?.color;
        field.headerTextColor = 'white';

        if (field.key === label.label) {
          let value = label.value.text;

          if (field.key === DocumentLabelKeys.lookupLabels.OrderedBy) {
            value =
              indexedDocument.labels.find(
                lbl => lbl.label === DocumentLabelKeys.nonLookupLabels.OrderedByName
              )?.value.text || '';
          } else if (field.key === DocumentLabelKeys.lookupLabels.Workflow) {
            value =
              indexedDocument.labels.find(
                lbl => lbl.label === DocumentLabelKeys.nonLookupLabels.WorkflowName
              )?.value.text || '';
          }

          field.value = value;
          field.confidence = label.value.confidence;
        }
      });
    });
    return parsedFields;
  }

  getActivityLabel(labelName: string, value: string, indexedData: IndexedData): IndexedLabel {
    const label = this.findLabelInCompositeData(labelName, indexedData);
    label.value.text = value;
    label.value.confidence = 1;

    return label;
  }

  internalEscalationCount(indexedDocument: IndexedData): number {
    return indexedDocument.activities.filter(
      act => act.escalation && act.escalation.category.issue === EscalationCategoryTypes.IndexerQa
    ).length;
  }

  updateChangedLabels(
    labelName: string,
    indexedDocument: IndexedData,
    changedLabels: IndexedLabel[]
  ): IndexedLabel[] {
    const label = this.findLabelInCompositeData(labelName, indexedDocument);
    const labelAlreadyExists = changedLabels.find(lbl => lbl.label === label.label);

    if (changedLabels.length === 0 || !labelAlreadyExists) {
      changedLabels.push(label);
    }

    return changedLabels;
  }

  generateChangeLog(indexedDocument: IndexedData, changedLabels: IndexedLabel[]): ChangeLog[] {
    return changedLabels.reduce((acc, prevValueLabel) => {
      const currentValueLabel = this.findLabelInCompositeData(
        prevValueLabel.label,
        indexedDocument
      );

      acc.push({
        previous: prevValueLabel,
        current: currentValueLabel,
      });

      return acc;
    }, []);
  }

  addActivity(
    indexedDocument: IndexedData,
    changedLabels: IndexedLabel[],
    activityType: string,
    indexer: string,
    escalation: Escalation,
    startDate: string,
    changeLog: ChangeLog[]
  ): void {
    const endDate = DateTime.local().toString();

    const activityOrdinal = Number(indexedDocument.activities.length) + 1;

    const activity: Activity = {
      activity: activityType,
      changeLog,
      description: '',
      endDate,
      escalation,
      indexer,
      labels: changedLabels,
      ordinal: activityOrdinal,
      startDate,
    };

    indexedDocument.activities.push(activity);
  }

  getFieldValidationMessage(field: FieldBase<string>): string {
    if (!field.value) {
      return '';
    }

    let message = '';

    switch (field.type) {
      case InputDataTypes.Number:
        message = !this.validatorService.numericValidator(field.value)
          ? 'Invalid format. Numeric only'
          : '';
        break;
      case InputDataTypes.Currency:
        message = !this.validateCurrencyField(field) ? 'Invalid format. Currency only' : '';
        break;
      case InputDataTypes.Date:
        message = !this.validatorService.dateValidator(field.value)
          ? 'Invalid format. Please use mm/dd/yyyy'
          : '';
        break;
      default:
        message = '';
    }

    return message;
  }

  getNextDocumentRequestBody(store: any): SearchBodyRequest {
    const orgIds = store.core.filteredBuyers.map(buyer => buyer.id);
    let currentPage = store.core.currentPage;

    if (!currentPage) {
      const compositeData = store.indexingPage?.compositeData
        ? store.indexingPage?.compositeData
        : store.archiveInvoicePage?.document;
      currentPage = this.determineCurrentPage(compositeData);
    }

    switch (currentPage) {
      case AppPages.Queue:
        return {
          Controls: {
            Page: 1,
            PageSize: 30,
            SourceId: SearchContext.AvidSuite,
            SearchAllPages: true,
          },
          Filters: {
            ...store.indexingPage.pageFilters,
            buyerId:
              !store.pendingPage || store.pendingPage.filters.buyerId.length === 0
                ? orgIds.slice(0, 10)
                : store.pendingPage.filters.buyerId.map(buyer => buyer.id),
            escalationCategoryIssue: [EscalationCategoryTypes.None],
            ingestionType: [IngestionTypes.Email, IngestionTypes.Scan],
            isSubmitted: [0],
          },
          SortField:
            store.pendingPage?.sortedColumnData &&
            Object.keys(store.pendingPage?.sortedColumnData)?.length > 0
              ? Object.keys(store.pendingPage?.sortedColumnData)[0]
              : AdvancedFiltersKeys.DateReceived,
          SortDirection:
            store.pendingPage?.sortedColumnData &&
            Object.keys(store.pendingPage?.sortedColumnData)?.length > 0
              ? (Object.values(store.pendingPage?.sortedColumnData)[0] as SortDirection)
              : SortDirection.Ascending,
        };
      case AppPages.Research:
        return {
          Controls: {
            Page: 1,
            PageSize: 30,
            SourceId: SearchContext.AvidSuite,
            SearchAllPages: true,
          },
          Filters: {
            ...store.indexingPage.pageFilters,
            buyerId:
              !store.researchPage || store.researchPage.filters.buyerId.length === 0
                ? orgIds.slice(0, 10)
                : store.researchPage.filters.buyerId.map(buyer => buyer.id),
            escalationCategoryIssue: store.researchPage?.filters
              ? [...store.researchPage.filters.escalationCategoryIssue]
              : [
                  ...store.core.researchPageEscalationCategoryList,
                  `-${EscalationCategoryTypes.RecycleBin}`,
                  `-${EscalationCategoryTypes.Void}`,
                  `-${EscalationCategoryTypes.None}`,
                  `-${EscalationCategoryTypes.RejectToSender}`,
                ],
            isSubmitted: [0],
          },
          SortField:
            store.researchPage?.sortedColumnData &&
            Object.keys(store.researchPage?.sortedColumnData)?.length > 0
              ? Object.keys(store.researchPage?.sortedColumnData)[0]
              : AdvancedFiltersKeys.DateReceived,
          SortDirection:
            store.researchPage?.sortedColumnData &&
            Object.keys(store.researchPage?.sortedColumnData)?.length > 0
              ? (Object.values(store.researchPage?.sortedColumnData)[0] as SortDirection)
              : SortDirection.Ascending,
        };
      case AppPages.UploadsQueue:
        return {
          Controls: {
            Page: 1,
            PageSize: 30,
            SourceId: SearchContext.AvidSuite,
            SearchAllPages: true,
          },
          Filters: {
            ...store.indexingPage.pageFilters,
            buyerId:
              !store.uploadsQueuePage || store.uploadsQueuePage.filters.buyerId.length === 0
                ? orgIds.slice(0, 10)
                : store.uploadsQueuePage.filters.buyerId.map(buyer => buyer.id),
            escalationCategoryIssue: [EscalationCategoryTypes.None],
            ingestionType: [IngestionTypes.Api],
            isSubmitted: [0],
            sourceEmail: [store.core.userAccount?.preferred_username],
          },
          SortField:
            store.uploadsQueuePage?.sortedColumnData &&
            Object.keys(store.uploadsQueuePage?.sortedColumnData)?.length > 0
              ? Object.keys(store.uploadsQueuePage?.sortedColumnData)[0]
              : AdvancedFiltersKeys.DateReceived,
          SortDirection:
            store.uploadsQueuePage?.sortedColumnData &&
            Object.keys(store.uploadsQueuePage?.sortedColumnData)?.length > 0
              ? (Object.values(store.uploadsQueuePage?.sortedColumnData)[0] as SortDirection)
              : SortDirection.Ascending,
        };
      case AppPages.RecycleBin:
        return {
          Controls: {
            Page: 1,
            PageSize: 30,
            SourceId: SearchContext.AvidSuite,
            SearchAllPages: true,
          },
          Filters: {
            ...store.indexingPage.pageFilters,
            buyerId:
              !store.recycleBinPage || store.recycleBinPage.filters.buyerId.length === 0
                ? orgIds.slice(0, 10)
                : store.recycleBinPage.filters.buyerId.map(buyer => buyer.id),
            escalationCategoryIssue: [EscalationCategoryTypes.RecycleBin],
            isSubmitted: [0],
            dateRecycled:
              store.indexingPage.pageFilters?.dateRecycled ??
              this.pageHelperService.getDateRange(31),
          },
          SortField:
            store.recycleBinPage?.sortedColumnData &&
            Object.keys(store.recycleBinPage?.sortedColumnData)?.length > 0
              ? Object.keys(store.recycleBinPage?.sortedColumnData)[0]
              : AdvancedFiltersKeys.DateReceived,
          SortDirection:
            store.recycleBinPage?.sortedColumnData &&
            Object.keys(store.recycleBinPage?.sortedColumnData)?.length > 0
              ? (Object.values(store.recycleBinPage?.sortedColumnData)[0] as SortDirection)
              : SortDirection.Descending,
        };
      case AppPages.Archive:
        return {
          Controls: {
            Page: 1,
            PageSize: 30,
            SourceId: SearchContext.AvidSuite,
            SearchAllPages: true,
          },
          Filters: {
            ...store.archivePage.pageFilters,
            buyerId:
              !store.archivePage || store.archivePage.filters.buyerId.length === 0
                ? orgIds.slice(0, 10)
                : store.archivePage.filters.buyerId.map(buyer => buyer.id),
            isSubmitted: [1],
          },
          SortField:
            store.archivePage?.sortedColumnData &&
            Object.keys(store.archivePage?.sortedColumnData)?.length > 0
              ? Object.keys(store.archivePage?.sortedColumnData)[0]
              : AdvancedFiltersKeys.DateSubmitted,
          SortDirection:
            store.archivePage?.sortedColumnData &&
            Object.keys(store.archivePage?.sortedColumnData)?.length > 0
              ? (Object.values(store.archivePage?.sortedColumnData)[0] as SortDirection)
              : SortDirection.Descending,
        };
      default:
        return {
          Controls: {
            Page: 1,
            PageSize: 30,
            SourceId: SearchContext.AvidSuite,
            SearchAllPages: true,
          },
          Filters: {
            buyerId: [],
          },
          SortField: AdvancedFiltersKeys.DateReceived,
          SortDirection: SortDirection.Ascending,
        };
    }
  }

  updateLabelValueUponThresholdCheck(
    labels: IndexedLabel[],
    fields: FieldBase<string>[],
    isSponsorUser: boolean,
    hasEscalation: boolean,
    supplierPredictionIsActive: boolean
  ): IndexedLabel[] {
    const lookupFields = [
      DocumentLabelKeys.lookupLabels.Supplier,
      DocumentLabelKeys.lookupLabels.SupplierAddress,
      DocumentLabelKeys.lookupLabels.ShipToName,
      DocumentLabelKeys.lookupLabels.ShipToAddress,
      DocumentLabelKeys.lookupLabels.CustomerAccountNumber,
    ];

    return labels.map(label => {
      const matchingField = fields.find(fld => fld.key === label.label);

      const nonLookupFieldCheck =
        isSponsorUser &&
        lookupFields.indexOf(label.label as any) === -1 &&
        label.value.confidence >= matchingField?.displayThreshold.view * 0.01;

      const lookupFieldCheck =
        supplierPredictionIsActive &&
        this.canDisplayIdentifierSearchValues(labels) &&
        isSponsorUser &&
        lookupFields.indexOf(label.label as any) > -1 &&
        label.value.confidence >= matchingField?.displayThreshold.view * 0.01;

      if (
        !matchingField ||
        label.value.confidence === 1 ||
        hasEscalation ||
        lookupFieldCheck ||
        nonLookupFieldCheck
      ) {
        return label;
      } else {
        label.value.text =
          label.label === DocumentLabelKeys.nonLookupLabels.InvoiceType
            ? InvoiceTypes.Standard
            : '';
        label.value.boundingBox = [];
        return label;
      }
    });
  }

  hasNewAccountActivity(activities: Activity[]): boolean {
    return activities.find(activity => activity.activity === ActivityTypes.CreateNewAccount)
      ? true
      : false;
  }

  getFieldsToRemove(escalationIssue: string, labels: IndexedLabel[]): string[] {
    const fields = [];
    if (escalationIssue === EscalationCategoryTypes.NonInvoiceDocument) {
      const invoiceNumber = labels.find(
        lbl => lbl.label === DocumentLabelKeys.nonLookupLabels.InvoiceNumber
      )?.value.text;
      const invoiceAmount = labels.find(
        lbl => lbl.label === DocumentLabelKeys.nonLookupLabels.InvoiceAmount
      )?.value.text;

      if (invoiceNumber.length > 0) {
        fields.push(DocumentLabelKeys.nonLookupLabels.InvoiceNumber);
      }

      if (invoiceAmount.toString().length > 0) {
        fields.push(DocumentLabelKeys.nonLookupLabels.InvoiceAmount);
      }
    }

    return fields;
  }

  requiredFieldsValidation(indexedDocument: IndexedData, fields: FieldBase<string>[]): boolean {
    let missingRequiredFields = false;

    fields
      .filter(field => field.required)
      .forEach(field => {
        if (!indexedDocument.labels.find(lbl => lbl.label === field.key)?.value?.text) {
          missingRequiredFields = true;
        }
      });

    return missingRequiredFields;
  }

  getNotifications(indexedDocument: IndexedData): any[] {
    const notifications = [];
    const invoiceAmount = indexedDocument.labels.find(
      lbl => lbl.label === DocumentLabelKeys.nonLookupLabels.InvoiceAmount
    )?.value?.text;

    const invoiceNumber = indexedDocument.labels.find(
      lbl => lbl.label === DocumentLabelKeys.nonLookupLabels.InvoiceNumber
    )?.value?.text;

    const accountNumber = indexedDocument.labels.find(
      lbl => lbl.label === DocumentLabelKeys.lookupLabels.CustomerAccountNumber
    )?.value?.text;

    if (accountNumber === 'none' && invoiceNumber === '') {
      notifications.push({
        title: 'Confirm',
        message: `The account number selected is 'none'. Invoice number will be auto-formatted. Are you sure this is correct?`,
      });
    }

    if (parseInt(invoiceAmount) > 500000) {
      notifications.push({
        title: 'Confirm',
        message: 'This invoice is over $500,000. Are you sure you want to proceed with approval?',
      });
    }

    return notifications;
  }

  getNewCustomerAccount(
    indexedData: IndexedData,
    existingRecords: Array<LookupCustomerAccount>
  ): LookupCustomerAccount {
    if (!this.hasNewAccountActivity(indexedData.activities)) {
      return null;
    }

    const createActivity = indexedData.activities
      .filter(activity => activity.activity === ActivityTypes.CreateNewAccount)
      .sort((a, b) => b.ordinal - a.ordinal);

    const newAccount = {
      vendorAccountId: 0,
      accountNo: createActivity[0].labels.find(
        x => x.label === DocumentLabelKeys.lookupLabels.CustomerAccountNumber
      )?.value.text,
      isActive: true,
      propertyId: 0,
      propertyName: null,
      propertyAddress: null,
      termTypeId:
        Number(
          createActivity[0].labels.find(x => x.label === DocumentLabelKeys.nonLookupLabels.Terms)
            ?.value.text
        ) ?? 0,
      allowRetainage: false,
    };

    if (
      existingRecords?.find(
        x => x.accountNo.trim().toLowerCase() === newAccount.accountNo.trim().toLowerCase()
      )
    ) {
      return null;
    }

    return newAccount;
  }

  getPaymentTerms(): LookupPaymentTerms[] {
    try {
      const paymentTerms = window.localStorage.getItem('paymentTerms');

      if (paymentTerms) {
        const terms = JSON.parse(paymentTerms);

        if (Array.isArray(terms)) {
          return terms;
        }
      }

      return [];
    } catch (error) {
      return [];
    }
  }

  setPaymentTerms(paymentTerms: LookupPaymentTerms[]): void {
    if (paymentTerms) {
      window.localStorage.setItem('paymentTerms', JSON.stringify(paymentTerms));
    }
  }

  getPredictedValue(
    fields: FieldBase<string>[],
    indexedLabels: IndexedLabel[],
    labelName: string,
    isSponsorUser: boolean
  ): string {
    const label = indexedLabels.find((label: IndexedLabel) => label.label === labelName);
    const field = fields.find(fld => fld.key === label?.label);
    const lookupFieldCheck =
      this.canDisplayPredictedValues(indexedLabels) &&
      this.canDisplayIdentifierSearchValues(indexedLabels) &&
      isSponsorUser &&
      label?.value.confidence >= field?.displayThreshold.view * 0.01;

    return lookupFieldCheck ? label.value.text : null;
  }

  determineCurrentPage(compositeData: CompositeDocument): string {
    const recentActivity = compositeData?.indexed?.activities
      .filter(
        activity =>
          activity.activity !== ActivityTypes.Save &&
          activity.activity !== ActivityTypes.CreateNewAccount &&
          activity.activity !== ActivityTypes.Swap &&
          activity.activity !== ActivityTypes.Update &&
          activity.activity !== ActivityTypes.Submit
      )
      .pop();

    const ingestionType =
      this.findLabelInCompositeData(
        DocumentLabelKeys.nonLookupLabels.IngestionType,
        compositeData.indexed
      )?.value.text ?? '';

    if (compositeData.indexed.isSubmitted) {
      return AppPages.Archive;
    }

    if (
      recentActivity.activity === ActivityTypes.Create &&
      (ingestionType === IngestionTypes.Email || ingestionType === IngestionTypes.Scan)
    ) {
      return AppPages.Queue;
    }

    if (recentActivity.activity === ActivityTypes.Create && ingestionType === IngestionTypes.Api) {
      return AppPages.UploadsQueue;
    }

    if (
      recentActivity.activity === ActivityTypes.Exception &&
      recentActivity.escalation.category.issue !== EscalationCategoryTypes.RecycleBin
    ) {
      return AppPages.Research;
    }

    if (
      recentActivity.activity === ActivityTypes.Exception &&
      recentActivity.escalation.category.issue === EscalationCategoryTypes.RecycleBin
    ) {
      return AppPages.RecycleBin;
    }

    return '';
  }

  getPageData(
    storeSnapShot: any,
    currentPage: string
  ): { invoicesPageCount: number; invoices: Document[] } {
    switch (currentPage) {
      case AppPages.Queue:
        return {
          invoicesPageCount: storeSnapShot.core.documentCount,
          invoices: storeSnapShot?.pendingPage?.invoices,
        };
      case AppPages.UploadsQueue:
        return {
          invoicesPageCount: storeSnapShot.core.myUploadsCount,
          invoices: storeSnapShot?.uploadsQueuePage?.invoices,
        };
      case AppPages.Research:
        return {
          invoicesPageCount: storeSnapShot.core.escalationCount,
          invoices: storeSnapShot?.researchPage?.invoices,
        };
      case AppPages.RecycleBin:
        return {
          invoicesPageCount: storeSnapShot.core.recycleBinCount,
          invoices: storeSnapShot?.recycleBinPage?.invoices,
        };
      default:
        return null;
    }
  }

  getDuplicateDocumentId(activities: Activity[]): string {
    const duplicateActivity = activities
      .filter(activity => activity.activity === ActivityTypes.Exception)
      .find(
        activity =>
          activity.escalation?.category.issue === EscalationCategoryTypes.DuplicateResearch
      );

    if (!duplicateActivity) {
      return null;
    }

    try {
      return JSON.parse(duplicateActivity.escalation.description).documentId;
    } catch (error) {
      return null;
    }
  }

  canDisplayPredictedValues(labels: IndexedLabel[]): boolean {
    return Boolean(
      Number(
        labels.find(lbl => lbl.label === DocumentLabelKeys.nonLookupLabels.DisplayPredictedValues)
          ?.value.text
      )
    );
  }

  private canDisplayIdentifierSearchValues(labels: IndexedLabel[]): boolean {
    return Boolean(
      Number(
        labels.find(
          lbl => lbl.label === DocumentLabelKeys.nonLookupLabels.DisplayIdentifierSearchValues
        )?.value.text
      )
    );
  }

  private validateCurrencyField(field: FieldBase<string>): boolean {
    let fieldValue = field.value.replace(/[^-0-9.]/g, '');

    if (fieldValue?.endsWith('-')) {
      fieldValue = `-${fieldValue.replace('-', '')}`;
      field.value = fieldValue;
    }
    if (!fieldValue || isNaN(Number(fieldValue)) || Number(fieldValue) > Integer.MAX_LIMIT) {
      return false;
    }

    fieldValue = this.formatterService.getFormattedFieldValue(field, fieldValue);

    return this.validatorService.currencyValidator(fieldValue) ? true : false;
  }

  private needsColorLabel(labelName: string, labelColors: LabelColor[]): boolean {
    return labelColors.find((lc: LabelColor) => lc?.labelName === labelName) ? false : true;
  }

  private findLabelInCompositeData(labelName: string, indexedDocument: IndexedData): IndexedLabel {
    return indexedDocument?.labels.find((label: IndexedLabel) => label?.label === labelName);
  }
}
