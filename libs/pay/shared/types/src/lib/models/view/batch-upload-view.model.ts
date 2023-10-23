export const BATCH_UPLOAD_CONTENT_KEY = 'batchUploadFeature';

export interface IBatchUploadFeatureView {
  title: string;
  tabs: {
    singleErp: string;
    multipleErps: string;
  };
  submitView: IBatchSubmitFooterView;
}

export interface IBatchSubmitFooterView {
  label: string;
  description: string;
}
