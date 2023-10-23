import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxsModule, Store } from '@ngxs/store';
import { cold } from 'jasmine-marbles';
import { of } from 'rxjs';
import { dialogRefStub, propertyGroupStub } from '../../../../../test/test-stubs';

import { ConfirmationModalComponent } from './confirmation-modal.component';

describe('ConfirmationModalComponent', () => {
  let component: ConfirmationModalComponent;
  let fixture: ComponentFixture<ConfirmationModalComponent>;
  let store: Store;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConfirmationModalComponent],
      imports: [NgxsModule.forRoot([])],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefStub },
        {
          provide: MAT_DIALOG_DATA,
          useValue: { data: {} },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    store = TestBed.inject(Store);
    fixture = TestBed.createComponent(ConfirmationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('close()', () => {
    beforeEach(() => {
      jest.spyOn(dialogRefStub, 'close');
      component.close();
    });

    it('should close dialog ref', () => expect(dialogRefStub.close).toHaveBeenCalled());
  });

  describe('getPropertyGroupName()', () => {
    it('should get property DisplayName from propertyGroup', () => {
      jest.spyOn(store, 'select').mockReturnValue(of(() => propertyGroupStub));
      const expected = cold('(a|)', { a: propertyGroupStub.DisplayName });

      expect(component.getPropertyGroupName('')).toBeObservable(expected);
    });

    it('should get property Name from propertyGroup', () => {
      propertyGroupStub.DisplayName = '';
      jest.spyOn(store, 'select').mockReturnValue(of(() => propertyGroupStub));
      const expected = cold('(a|)', { a: propertyGroupStub.Name });

      expect(component.getPropertyGroupName('')).toBeObservable(expected);
    });
  });

  describe('isArray()', () => {
    let result;
    beforeEach(() => {
      result = component.isArray([]);
    });
    it('should return if value is array', () => expect(result).toBe(true));
  });
});
