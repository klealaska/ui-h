import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslatePipe } from '@ngx-translate/core';
import { ButtonComponent, InputComponent } from '@ui-coe/shared/ui-v2';
import { MockPipe } from 'ng-mocks';

import { PdfPasswordComponent } from './pdf-password.component';

const dialogRefStub = {
  close: jest.fn(),
};

describe('PdfPasswordComponent', () => {
  let component: PdfPasswordComponent;
  let fixture: ComponentFixture<PdfPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PdfPasswordComponent, MockPipe(TranslatePipe)],
      imports: [ButtonComponent, InputComponent, BrowserAnimationsModule, FormsModule],
      providers: [
        {
          provide: MatDialogRef,
          useValue: dialogRefStub,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PdfPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => jest.clearAllMocks());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('submit()', () => {
    beforeEach(() => {
      component.formCtrl.setValue('mock');
      component.submit();
    });

    it('should close dialog and pass value along with it', () =>
      expect(dialogRefStub.close).toHaveBeenNthCalledWith(1, 'mock'));
  });

  describe('close()', () => {
    beforeEach(() => {
      component.close();
    });

    it('should close dialog', () => expect(dialogRefStub.close).toHaveBeenCalledTimes(1));
  });
});
