import { ChangeDetectorRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { AxTranslatePipe } from './translate.pipe';

describe('TranslatePipe', () => {
  let pipe: AxTranslatePipe;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [ChangeDetectorRef, AxTranslatePipe, TranslateService],
    });
    pipe = TestBed.inject(AxTranslatePipe);
  });
  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });
  it('create an instance nth level deep', () => {
    const obj = {
      content: ' {{ test1 }}',
      address: {
        line: '{{ line1 }} value',
        postal: {
          code: ' {{ code }} 123',
        },
        station: 'station',
      },
    };
    jest.spyOn(pipe['translate'], 'get').mockReturnValue(of(obj));
    const spy = jest.spyOn(pipe, 'ngxObjectInterpolation');
    const result = pipe.transform('test', { test1: 'jk', code: 'new', line1: 'my line' });
    expect(result).toStrictEqual({
      content: ' jk',
      address: {
        line: 'my line value',
        postal: {
          code: ' new 123',
        },
        station: 'station',
      },
    });
    expect(spy).toHaveBeenCalledTimes(7);
  });

  it('should call ngxObjectInterpolation', () => {
    const obj = {
      content: ' {{ test1 }}',
      address: {
        line: '{{ line1 }} value',
      },
    };
    const result = pipe.ngxObjectInterpolation(obj, { test1: 'jk', line1: 'my line' });
    expect(result).toStrictEqual({
      content: ' jk',
      address: {
        line: 'my line value',
      },
    });
  });
});
