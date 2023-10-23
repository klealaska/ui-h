import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { ExpansionPanelComponent } from './expansion-panel.component';

describe('ExpansionPanelComponent', () => {
  let component: ExpansionPanelComponent;
  let fixture: ComponentFixture<ExpansionPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoopAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ExpansionPanelComponent);
    component = fixture.componentInstance;
    component.title = 'Title';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('type', () => {
    it('should have primary class and secondary class should be falsy', () => {
      component.type = 'primary';
      fixture.detectChanges();
      const primaryClass = fixture.nativeElement.querySelector('.ax-expansion-panel-primary');
      const secondaryClass = fixture.nativeElement.querySelector('.ax-expansion-panel-secondary');
      expect(primaryClass).toBeTruthy();
      expect(secondaryClass).toBeFalsy();
    });
    it('should have secondary class and primary class should be falsy', () => {
      component.type = 'secondary';
      fixture.detectChanges();
      const primaryClass = fixture.nativeElement.querySelector('.ax-expansion-panel-primary');
      const secondaryClass = fixture.nativeElement.querySelector('.ax-expansion-panel-secondary');
      expect(secondaryClass).toBeTruthy();
      expect(primaryClass).toBeFalsy();
    });
  });

  describe('title', () => {
    it('should have title', () => {
      const title = fixture.nativeElement.querySelector('.ax-expansion-panel--header__title');
      expect(title.textContent).toEqual('Title');
    });
    it('should not have title', () => {
      component.title = '';
      fixture.detectChanges();
      const title = fixture.nativeElement.querySelector('.ax-expansion-panel--header__title');
      expect(title.textContent).toBeFalsy();
    });
  });

  describe('disabled', () => {
    it('should not be disabled', () => {
      component.disabled = false;
      fixture.detectChanges();
      const expansionPanel = fixture.nativeElement.querySelector('.ax-expansion-panel');
      expect(expansionPanel.getAttribute('ng-reflect-disabled')).toEqual('false');
    });
    it('should be disabled', () => {
      component.disabled = true;
      fixture.detectChanges();
      const expansionPanel = fixture.nativeElement.querySelector('.ax-expansion-panel');
      expect(expansionPanel.getAttribute('ng-reflect-disabled')).toEqual('true');
    });
  });

  describe('expanded', () => {
    it('should not be expanded', () => {
      component.expanded = false;
      fixture.detectChanges();
      const expansionPanel = fixture.nativeElement.querySelector('.ax-expansion-panel');
      expect(expansionPanel.getAttribute('ng-reflect-expanded')).toEqual('false');
    });
    it('should be expanded', () => {
      component.expanded = true;
      fixture.detectChanges();
      const expansionPanel = fixture.nativeElement.querySelector('.ax-expansion-panel');
      expect(expansionPanel.getAttribute('ng-reflect-expanded')).toEqual('true');
    });
  });

  describe('opened', () => {
    it('should emit data on expanded event', () => {
      const spy = jest.spyOn(component.opened, 'emit');

      const expansionPanel = fixture.nativeElement.querySelector('.ax-expansion-panel--header');
      expansionPanel.click();

      fixture.detectChanges();
      expect(spy).toHaveBeenCalledWith('opened');
    });
  });

  describe('closed', () => {
    it('should emit data on closed event', () => {
      component.expanded = true;
      fixture.detectChanges();
      const spy = jest.spyOn(component.closed, 'emit');

      const expansionPanel = fixture.nativeElement.querySelector('.ax-expansion-panel--header');
      expansionPanel.click();

      fixture.detectChanges();
      expect(spy).toHaveBeenCalledWith('closed');
    });
  });

  describe('afterExpand', () => {
    it('should emit data on afterExpand event', async () => {
      const spy = jest.spyOn(component.afterExpand, 'emit');

      const expansionPanel = fixture.nativeElement.querySelector('.ax-expansion-panel--header');
      expansionPanel.click();

      fixture.detectChanges();
      expect(await spy).toHaveBeenCalledWith('afterExpand');
    });
  });

  describe('afterCollapse', () => {
    it('should emit data on afterCollapse event', async () => {
      component.expanded = true;
      fixture.detectChanges();
      const spy = jest.spyOn(component.afterExpand, 'emit');

      const expansionPanel = fixture.nativeElement.querySelector('.ax-expansion-panel--header');
      expansionPanel.click();

      fixture.detectChanges();
      expect(await spy).toHaveBeenCalledWith('afterExpand');
    });
  });
});
