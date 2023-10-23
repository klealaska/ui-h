import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';

import { NestedBottomSheetComponent } from './nested-bottom-sheet.components';

describe('NestedBottomSheetComponent', () => {
  let component: NestedBottomSheetComponent<any>;
  let fixture: ComponentFixture<NestedBottomSheetComponent<any>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NestedBottomSheetComponent],
      providers: [{ provide: MAT_BOTTOM_SHEET_DATA, useValue: [] }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NestedBottomSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
