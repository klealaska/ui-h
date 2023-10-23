import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BamEditFooterComponent } from './bam-edit-footer.component';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('BamEditFooterComponent', () => {
  let component: BamEditFooterComponent;
  let fixture: ComponentFixture<BamEditFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BamEditFooterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BamEditFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit a cancelClick event', () => {
    const cancelButtonEl: DebugElement = fixture.debugElement.query(By.css('.bam-edit__cancel'));

    jest.spyOn(component.cancelClick, 'emit');
    cancelButtonEl.triggerEventHandler('click');

    expect(component.cancelClick.emit).toHaveBeenCalled();
  });

  it('should emit a cancelClick event', () => {
    const saveButtonEl: DebugElement = fixture.debugElement.query(By.css('.bam-edit__save'));

    jest.spyOn(component.saveClick, 'emit');
    saveButtonEl.triggerEventHandler('click');

    expect(component.saveClick.emit).toHaveBeenCalled();
  });
});
