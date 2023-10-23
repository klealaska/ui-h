import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectorHeaderComponent } from './connector-header.component';

describe('ConnectorHeaderComponent', () => {
  let component: ConnectorHeaderComponent;
  let fixture: ComponentFixture<ConnectorHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConnectorHeaderComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectorHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
