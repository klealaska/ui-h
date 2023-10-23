import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCheckbox } from '@angular/material/checkbox';
import { registrationEnablementStub } from '../../../../../test/test-stubs';
import { MockComponents } from 'ng-mocks';

import { OperationItemComponent } from './operation-item.component';

describe('OperationItemComponent', () => {
  let component: OperationItemComponent;
  let fixture: ComponentFixture<OperationItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OperationItemComponent, MockComponents(MatCheckbox)],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OperationItemComponent);
    component = fixture.componentInstance;
    component.enablement = registrationEnablementStub;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('handleCheckboxChange', () => {
    beforeEach(() => {
      jest.spyOn(component.checkBoxChanged, 'emit');
    });

    it('should emit a checkBoxChanged event when checked', () => {
      component.handleCheckboxChange(true);
      expect(component.checkBoxChanged.emit).toHaveBeenCalledWith(true);
    });

    it('should emit a checkBoxChanged event when unchecked', () => {
      component.handleCheckboxChange(false);
      expect(component.checkBoxChanged.emit).toHaveBeenCalledWith(false);
    });

    it('should enable the upload button when checked', () => {
      component.handleCheckboxChange(true);
      expect(component.disableUpload).toBe(false);
    });

    it('should disable the upload button when unchecked', () => {
      component.handleCheckboxChange(false);
      expect(component.disableUpload).toBe(true);
    });
  });

  it('should get dataSource text', () => {
    expect(component.dataSourceText).toEqual(
      'Will be extracted directly from the accounting system'
    );
  });
});
