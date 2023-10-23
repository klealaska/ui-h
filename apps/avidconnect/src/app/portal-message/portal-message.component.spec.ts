import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortalMessageComponent } from './portal-message.component';

describe('PortalMessageComponent', () => {
  let component: PortalMessageComponent;
  let fixture: ComponentFixture<PortalMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PortalMessageComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PortalMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
