export interface LinkItem {
  id: string;
  displayName: string;
  route?: string;
}

export interface AxUser {
  firstName: string;
  lastName: string;
  options: LinkItem[];
}
