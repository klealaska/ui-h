import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectableCardComponent } from './selectable-card.component';

describe('SelectableCardComponent', () => {
  let component: SelectableCardComponent;
  let fixture: ComponentFixture<SelectableCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectableCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectableCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('selected', () => {
    it('should check if selected is false by default', () => {
      expect(component.selected).toBeFalsy();
      expect(fixture.nativeElement.querySelector('.card--selected')).toBeFalsy();
    });

    it('should toggle selected state', () => {
      const card = fixture.nativeElement.querySelector('.card');
      card.click();
      fixture.detectChanges();

      expect(component.selected).toBeTruthy();
      expect(fixture.nativeElement.querySelector('.card--selected')).toBeTruthy();
    });
  });

  describe('disabled', () => {
    it('should check if disabled is false by default', () => {
      expect(component.disabled).toBeFalsy();
      expect(fixture.nativeElement.querySelector('.card--disabled')).toBeFalsy();
    });

    it('should toggle selected state', () => {
      const card = fixture.nativeElement.querySelector('.card');
      component.disabled = true;
      fixture.detectChanges();

      expect(card.click()).toBeFalsy();
      expect(fixture.nativeElement.querySelector('.card--disabled')).toBeTruthy();
    });
  });

  describe('checkbox', () => {
    beforeEach(() => {
      component.selected = true;
      fixture.detectChanges();
    });
    it('should check if checkbox is visable and classes are added', () => {
      expect(component.checkbox).toBeTruthy();
      expect(fixture.nativeElement.querySelector('.card--hasCheckbox')).toBeTruthy();
      expect(fixture.nativeElement.querySelector('.card__checkbox')).toBeTruthy();
    });

    it('should check if checkbox is not visable and classes are not added', () => {
      component.checkbox = false;
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector('.card--hasCheckbox')).toBeFalsy();
      expect(fixture.nativeElement.querySelector('.card__checkbox')).toBeFalsy();
    });
  });

  describe('setSelected', () => {
    it('should check if card was clicked and function was executed', () => {
      const selectedState = jest.spyOn(component.selectedState, 'emit');
      const setSelected = jest.spyOn(component, 'setSelected');
      const card = fixture.nativeElement.querySelector('.card');
      card.click();

      expect(setSelected).toHaveBeenCalled();
      expect(selectedState).toHaveBeenCalled();
    });
  });
});
