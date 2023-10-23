import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContextMenuComponent } from './context-menu.component';
import { ElementRef } from '@angular/core';

describe('ContextMenuComponent', () => {
  let component: ContextMenuComponent;
  let fixture: ComponentFixture<ContextMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ContextMenuComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ContextMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit true when document click is outside the element', () => {
    const mockElementRef = {
      nativeElement: document.createElement('div'),
    };
    component['el'] = mockElementRef as ElementRef;
    const hideContextMenuEventSpy = jest.spyOn(component.hideContextMenuEvent, 'emit');
    const mockEvent = new MouseEvent('click', { bubbles: true });
    document.body.dispatchEvent(mockEvent);
    expect(hideContextMenuEventSpy).toHaveBeenCalledWith(true);
  });

  it('should not emit when document click is inside the element', () => {
    const mockElementRef = {
      nativeElement: document.createElement('div'),
    };
    component['el'] = mockElementRef as ElementRef;
    const hideContextMenuEventSpy = jest.spyOn(component.hideContextMenuEvent, 'emit');
    mockElementRef.nativeElement.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(hideContextMenuEventSpy).not.toHaveBeenCalled();
  });

  describe('unlockDocument', () => {
    beforeEach(() => {
      jest.spyOn(component.hideContextMenuEvent, 'emit').mockImplementation();
      jest.spyOn(component.unlockDocumentEvent, 'emit').mockImplementation();
      component.unlockDocument();
    });

    it('should emit hideContextMenu as true', () => {
      expect(component.hideContextMenuEvent.emit).toHaveBeenNthCalledWith(1, true);
    });

    it('should emit hideContextMenu as true', () => {
      expect(component.unlockDocumentEvent.emit).toHaveBeenCalled();
    });
  });
});
