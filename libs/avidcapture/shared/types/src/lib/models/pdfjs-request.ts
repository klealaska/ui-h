export interface PdfJsRequest {
  url: string;
  httpHeaders: { [Authorization: string]: string };
  withCredentials: boolean;
  password?: string;
  disableFontFace?: boolean;
}
