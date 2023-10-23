import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatChipsModule } from '@angular/material/chips';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TranslatePipe } from '@ngx-translate/core';
import { getBuyersStub } from '@ui-coe/avidcapture/shared/test';
import { ButtonComponent } from '@ui-coe/shared/ui-v2';
import { MockComponent, MockPipe } from 'ng-mocks';

import { ChipsAutocompleteComponent } from '../../chips-autocomplete/chips-autocomplete.component';
import { BuyerComponent } from './buyer.component';

const dialogRefStub = {
  close: jest.fn(),
};

describe('BuyerComponent', () => {
  let component: BuyerComponent;
  let fixture: ComponentFixture<BuyerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        BuyerComponent,
        MockComponent(ChipsAutocompleteComponent),
        MockPipe(TranslatePipe),
      ],
      imports: [MatDialogModule, ButtonComponent, MatChipsModule],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefStub },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            orgNames: getBuyersStub(),
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('view()', () => {
    beforeEach(() => {
      component.view();
    });

    it('should close dialog with buyers selected', () => {
      expect(dialogRefStub.close).toHaveBeenNthCalledWith(1, []);
    });
  });

  describe('filterTextChange()', () => {
    const buyers = getBuyersStub();

    describe('when text sent through equals buyer(s) in list', () => {
      const expectedResult = [buyers[1]];

      beforeEach(() => {
        component.filterTextChange('test');
      });

      it('should set orgNames to 1 result', () => {
        expect(component.orgNames.length).toBe(1);
        expect(component.orgNames).toEqual(expectedResult);
      });
    });

    describe('when text sent through is in CAPS & equals buyer(s) in list', () => {
      const expectedResult = [buyers[1]];

      beforeEach(() => {
        component.filterTextChange('TEST');
      });

      it('should set orgNames to 1 result', () => {
        expect(component.orgNames.length).toBe(1);
        expect(component.orgNames).toEqual(expectedResult);
      });
    });

    describe('when text sent through DOES NOT equal any buyer(s) in list', () => {
      beforeEach(() => {
        component.filterTextChange('abcd');
      });

      it('should set orgNames to 0 results', () => {
        expect(component.orgNames.length).toBe(0);
        expect(component.orgNames).toEqual([]);
      });
    });

    describe('when text sent through is empty', () => {
      beforeEach(() => {
        component.filterTextChange('');
      });

      it('should set orgNames back data.orgNames', () => {
        expect(component.orgNames).toEqual(buyers);
      });
    });
  });
});
