import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { hotKeysStub } from '@ui-coe/avidcapture/shared/test';
import { IconComponent } from '@ui-coe/shared/ui';
import { MockComponent, MockPipe } from 'ng-mocks';

import { HotkeysDialogComponent } from './hotkeys-dialog.component';
import { TranslatePipe } from '@ngx-translate/core';

const dialogRefStub = {
  close: jest.fn(),
};

describe('HotkeysDialogComponent', () => {
  let component: HotkeysDialogComponent;
  let fixture: ComponentFixture<HotkeysDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HotkeysDialogComponent, MockComponent(IconComponent), MockPipe(TranslatePipe)],
      imports: [MatDialogModule, MatIconModule],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefStub },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            hotkeys: hotKeysStub,
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HotkeysDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit()', () => {
    it('should have 1 hotkey', () => {
      fixture.detectChanges();
      expect(component.hotkeys.length).toEqual(1);
    });
  });

  describe('close()', () => {
    beforeEach(() => {
      component.close();
    });

    it('should close the dialogRef', () => expect(dialogRefStub.close).toHaveBeenCalled());
  });
});
