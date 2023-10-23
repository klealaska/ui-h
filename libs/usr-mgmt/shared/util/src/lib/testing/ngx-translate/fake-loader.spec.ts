import { FakeLoader } from './fake-loader';
import { translations } from './mock.translate';

describe('Fake Translate Loader', () => {
  it('should return list of mock translations', done => {
    const fakeLoader = new FakeLoader();
    fakeLoader.getTranslation('').subscribe(translation => {
      expect(translation).toBe(translations);
      done();
    });
  });
});
