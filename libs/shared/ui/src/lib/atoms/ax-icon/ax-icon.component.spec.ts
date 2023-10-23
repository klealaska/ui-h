import { SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DomSanitizer } from '@angular/platform-browser';

import { domSantizerStub } from '../../../testing/test-stubs';
import { AxIconComponent } from './ax-icon.component';

describe('AxIconComponent', () => {
  let component: AxIconComponent;
  let fixture: ComponentFixture<AxIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AxIconComponent],
      providers: [
        {
          provide: DomSanitizer,
          useValue: domSantizerStub,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AxIconComponent);
    component = fixture.componentInstance;
    component.svgData = 'mockSvgData';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set svg to mockSvgData', () => expect(component.svg).toBe('mockSvgData'));

  describe('ngOnChanges()', () => {
    describe('when having a currentValue', () => {
      beforeEach(() => {
        component.ngOnChanges({
          svgData: new SimpleChange('', 'safeString', true),
        });
        fixture.detectChanges();
      });

      it('should set svg to safeString', () => expect(component.svg).toBe('safeString'));
    });

    describe('when not having a currentValue', () => {
      beforeEach(() => {
        component.ngOnChanges({
          svgData: new SimpleChange(null, null, false),
        });
        fixture.detectChanges();
      });

      it('should not set svg to safeString', () => expect(component.svg).not.toBe('safeString'));
    });
  });
});
