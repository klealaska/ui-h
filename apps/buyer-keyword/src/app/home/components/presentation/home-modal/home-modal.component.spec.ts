import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ButtonComponent } from '@ui-coe/shared/ui-v2';
import { MockComponent } from 'ng-mocks';

import { HomeModalComponent } from './home-modal.component';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { Dictionary } from '@ngrx/entity';
import { of } from 'rxjs';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';

const dialogRefStub = {
  close: jest.fn(),
};

const matDialogDataStub = {
  customerName: 'mockCustomer',
};

describe('HomeModalComponent', () => {
  let component: HomeModalComponent;
  let fixture: ComponentFixture<HomeModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomeModalComponent, MockComponent(ButtonComponent)],
      imports: [
        BrowserAnimationsModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatIconModule,
        MatInputModule,
        HttpClientModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
      ],
      providers: [
        {
          provide: MatDialogRef,
          useValue: dialogRefStub,
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: matDialogDataStub,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeModalComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('confirm()', () => {
    beforeEach(() => {
      component.confirm();
    });
    it('should close dialog and pass value along with it', () => {
      expect(dialogRefStub.close).toHaveBeenNthCalledWith(1, true);
    });
  });

  describe('cancel()', () => {
    beforeEach(() => {
      component.cancel();
    });
    it('should close dialog', () => {
      expect(dialogRefStub.close).toHaveBeenNthCalledWith(1, false);
    });
  });

  describe('typeConfirm()', () => {
    beforeEach(() => {
      component.typeConfirm('mock');
    });

    it('should set the value to confirmText', () => expect(component.confirmText).toBe('mock'));
  });
});
