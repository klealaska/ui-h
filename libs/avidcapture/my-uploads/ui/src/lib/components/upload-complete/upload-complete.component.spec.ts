import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
import { UploadedDocumentMessage } from '@ui-coe/avidcapture/shared/types';
import { of } from 'rxjs';

import { UploadCompleteComponent } from './upload-complete.component';

const snackBarRefStub = { dismiss: jest.fn() } as any;
const messagesStub: UploadedDocumentMessage[] = [
  {
    fileName: 'mockSuccess',
    successful: true,
  },
  {
    fileName: 'mockFailure',
    successful: false,
  },
];

describe('UploadCompleteComponent', () => {
  let component: UploadCompleteComponent;
  let fixture: ComponentFixture<UploadCompleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UploadCompleteComponent],
      imports: [MatIconModule],
      providers: [
        {
          provide: MatSnackBarRef,
          useValue: snackBarRefStub,
        },
        {
          provide: MAT_SNACK_BAR_DATA,
          useValue: {
            messages$: of(messagesStub),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UploadCompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should define successfulMessages observable', done => {
    component.successfulMessages$.subscribe(messages => {
      expect(messages).toEqual(expect.arrayContaining([messagesStub[0]]));
      expect(messages.length).toBe(1);
      done();
    });
  });

  it('should define failedMessages observable', done => {
    component.failedMessages$.subscribe(messages => {
      expect(messages).toEqual(expect.arrayContaining([messagesStub[1]]));
      expect(messages.length).toBe(1);
      done();
    });
  });

  describe('close()', () => {
    beforeEach(() => {
      component.close();
    });

    it('should dismiss the snackBar', () =>
      expect(snackBarRefStub.dismiss).toHaveBeenCalledTimes(1));
  });
});
