/**
 * Interface for the 'Content' data
 */
export interface ContentEntity {
  id: string | number; // Primary ID
  attributes?: {
    content: string;
    title: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    imageUrl: string;
    displayName: string;
    route: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any;
  };
}

export interface AllContentResponse {
  homeData: ContentEntity;
  productsData: ContentEntity[];
}
