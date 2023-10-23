import { DuplicateDocumentIdPipe } from './duplicate-document-id.pipe';

describe('DuplicateDocumentIdPipe', () => {
  const pipe = new DuplicateDocumentIdPipe();

  afterEach(() => jest.clearAllMocks());

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  describe('when sourceId flag is NOT passed in', () => {
    const jsonObj = JSON.stringify({ documentId: '1', sourceDocumentId: '2' });

    it('should return documentId from json string', () => {
      expect(pipe.transform(jsonObj)).toBe('1');
    });
  });

  describe('when sourceId flag is passed in', () => {
    const jsonObj = JSON.stringify({ documentId: '1', sourceDocumentId: '2' });

    it('should return sourceDocumentId from json string', () => {
      expect(pipe.transform(jsonObj, true)).toBe('2');
    });
  });
});
