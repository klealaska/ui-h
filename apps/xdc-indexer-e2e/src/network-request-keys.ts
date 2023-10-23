export class NetworkRequestKeys {
  public static readonly getDocumentPDF = new NetworkRequestKeys(
    'getDocumentPDF',
    '@getDocumentPDF'
  );

  public static readonly getDocumentData = new NetworkRequestKeys(
    'getDocumentData',
    '@getDocumentData'
  );

  public static readonly buyerLookAhead = new NetworkRequestKeys(
    'buyerLookAhead',
    '@buyerLookAhead'
  );

  public static readonly skipDocument = new NetworkRequestKeys('skipDocument', '@skipDocument');

  public static readonly getNextDocument = new NetworkRequestKeys('nextDocument', '@nextDocument');

  public static readonly saveAction = new NetworkRequestKeys('saveAction', '@saveAction');

  public static readonly submitAction = new NetworkRequestKeys('submitAction', '@submitAction');

  public static readonly getSuppliers = new NetworkRequestKeys('suppliers', '@suppliers');

  public static readonly getProperties = new NetworkRequestKeys('properties', '@properties');

  public static readonly getCustomerAccounts = new NetworkRequestKeys(
    'customerAccounts',
    '@customerAccounts'
  );

  public static readonly search = new NetworkRequestKeys('search', '@search');

  public static readonly archiveSearch = new NetworkRequestKeys('archive', '@archive');

  private constructor(public readonly interceptAlias: string, public readonly waitAlias: string) {}
}
