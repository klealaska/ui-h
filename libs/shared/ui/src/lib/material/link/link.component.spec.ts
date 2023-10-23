import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';

import { LinkComponent } from './link.component';

describe('LinkComponent', () => {
  let component: LinkComponent;
  let fixture: ComponentFixture<LinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LinkComponent],
      imports: [MatButtonModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkComponent);
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
        component.disabled = false;
        component.onLinkClick();
      });

      it('should emit linkClick event', () => expect(component.linkClick.emit).toHaveBeenCalled());
    });

    describe('when link is disabled', () => {
      beforeEach(() => {
        jest.spyOn(component.linkClick, 'emit').mockImplementation();
        component.disabled = true;
        component.onLinkClick();
      });

      it('should emit linkClick event', () =>
        expect(component.linkClick.emit).not.toHaveBeenCalled());
    });
  });
});
