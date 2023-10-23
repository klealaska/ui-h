import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatOption } from '@angular/material/core';
import { MatFormField } from '@angular/material/form-field';
import { MatSelect } from '@angular/material/select';
import { MockComponents } from 'ng-mocks';

import { RegistrationEnablementOptionComponent } from './registration-enablement-option.component';

describe('RegistrationEnablementOptionComponent', () => {
  let component: RegistrationEnablementOptionComponent;
  let fixture: ComponentFixture<RegistrationEnablementOptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        RegistrationEnablementOptionComponent,
        MockComponents(MatCheckbox, MatSelect, MatOption, MatFormField),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrationEnablementOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('processFile', () => {
    const file = {} as any;
    beforeEach(() => {
      jest.spyOn(component.fileUploaded, 'emit');
      component.processFile(file);
    });

    it('should set file', () => {
      expect(component.file).toBe(file);
    });

    it('should emit fileUploaded', () => {
      expect(component.fileUploaded.emit).toHaveBeenCalledWith(file);
    });
  });
});
