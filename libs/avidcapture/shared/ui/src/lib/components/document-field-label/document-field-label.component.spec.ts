import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentFieldLabelComponent } from './document-field-label.component';

describe('DocumentFieldLabelComponent', () => {
  let component: DocumentFieldLabelComponent;
  let fixture: ComponentFixture<DocumentFieldLabelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DocumentFieldLabelComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentFieldLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
