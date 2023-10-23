enum appPages {
  Admin = 'admin',
  Archive = 'archive',
  Dashboard = 'dashboard',
  Queue = 'queue',
  RecycleBin = 'recyclebin',
  Research = 'research',
  UploadsQueue = 'my-uploads',
  IndexingPage = 'indexing',
  ErrorPage = 'error',
  MaintenancePage = 'maintenance',
}

enum Indexing {
  Document = 'document',
  File = 'file',
  GetNextDocument = 'GetNextDocument',
  Lookup = 'lookup',
}

export const AppPages = { ...appPages, Indexing };
export type AppPages = typeof AppPages;
