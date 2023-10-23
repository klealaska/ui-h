import { UppercaseWordPipe } from './uppercase-word.pipe';

describe('UppercaseWordPipe', () => {
  const pipe = new UppercaseWordPipe();

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  describe('when lowercased word comes in', () => {
    let value: string;

    beforeEach(() => {
      value = pipe.transform('test');
    });

    it('should return an uppercased word', () => {
      expect(value).toBe('Test');
    });
  });

  describe('when fully uppercased word comes in', () => {
    let value: string;

    beforeEach(() => {
      value = pipe.transform('TEST');
    });

    it('should return an uppercased word', () => {
      expect(value).toBe('Test');
    });
  });
});
