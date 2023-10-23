import { SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ConfidenceColorAssociationService } from '@ui-coe/avidcapture/core/util';
import { confidenceThresholdStub } from '@ui-coe/avidcapture/shared/test';
import { DropdownComponent } from '@ui-coe/shared/ui-v2';

import { DropdownFieldComponent } from './dropdown-field.component';

const confidenceColorAssociationServiceSpy = {
  getConfidenceColor: jest.fn(),
};

describe('DropdownFieldComponent', () => {
  let component: DropdownFieldComponent;
  let fixture: ComponentFixture<DropdownFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DropdownFieldComponent],
      imports: [BrowserAnimationsModule, FormsModule, DropdownComponent],
      providers: [
        {
          provide: ConfidenceColorAssociationService,
          useValue: confidenceColorAssociationServiceSpy,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DropdownFieldComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    jest.fn();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnChanges()', () => {
    describe('when confidenceThreshold is null', () => {
      beforeEach(() => {
        confidenceColorAssociationServiceSpy.getConfidenceColor.mockReturnValue('red');
        component.ngOnChanges({
          confidenceThreshold: null,
        });
      });

      it('should not call getConfidence colors from service', () =>
        expect(confidenceColorAssociationServiceSpy.getConfidenceColor).not.toHaveBeenCalled());

      it('should not set confidenceColor to red', () =>
        expect(component.confidenceColor).not.toBe('red'));
    });

    describe('when confidenceThreshold is not updated', () => {
      beforeEach(() => {
        confidenceColorAssociationServiceSpy.getConfidenceColor.mockReturnValue('red');
        component.ngOnChanges({
          confidenceThreshold: new SimpleChange(null, null, true),
        });
      });

      it('should not call getConfidence colors from service', () =>
        expect(confidenceColorAssociationServiceSpy.getConfidenceColor).not.toHaveBeenCalled());

      it('should not set confidenceColor to red', () =>
        expect(component.confidenceColor).not.toBe('red'));
    });

    describe('when confidenceThreshold is updated', () => {
      beforeEach(() => {
        component.ngOnChanges({
          confidenceThreshold: new SimpleChange(null, confidenceThresholdStub, true),
        });
      });

      it('should getConfidence colors from service', () =>
        expect(confidenceColorAssociationServiceSpy.getConfidenceColor).toHaveBeenCalled());

      it('should set confidenceColor to red', () => expect(component.confidenceColor).toBe('red'));
    });
  });

  describe('onSelectedItem()', () => {
    beforeEach(() => {
      jest.spyOn(component.dropdownChanged, 'emit').mockImplementation();
      confidenceColorAssociationServiceSpy.getConfidenceColor.mockReturnValue('green');
      component.onSelectedItem('');
    });

    it('should emit empty string for dropdownChanged', () =>
      expect(component.dropdownChanged.emit).toHaveBeenNthCalledWith(1, ''));

    it('should set the confidence color when new item is selected', () =>
      expect(component.confidenceColor).toBe('green'));
  });
});
