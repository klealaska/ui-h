import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AxLinkComponent } from './ax-link.component';

describe('AxLinkComponent', () => {
  let component: AxLinkComponent;
  let fixture: ComponentFixture<AxLinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AxLinkComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AxLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onLinkClick()', () => {
    describe('when link is not disabled', () => {
      beforeEach(() => {
        jest.spyOn(component.linkClick, 'emit').mockImplementation();
        component.isLocked = false;
        component.onLinkClick();
      });

      it('should emit linkClick event', () => expect(component.linkClick.emit).toHaveBeenCalled());
    });

    describe('when link is disabled', () => {
      beforeEach(() => {
        jest.spyOn(component.linkClick, 'emit').mockImplementation();
        component.isLocked = true;
        component.onLinkClick();
      });

      it('should emit linkClick event', () =>
        expect(component.linkClick.emit).not.toHaveBeenCalled());
    });
  });
});
