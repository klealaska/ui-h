import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';

import { AxCurrentUserComponent } from '../../molecules/ax-current-user/ax-current-user.component';
import { AxPageTitleComponent } from '../../molecules/ax-page-title/ax-page-title.component';
import { AxTopHeaderComponent } from './ax-top-header.component';

describe('AxTopHeaderComponent', () => {
  let component: AxTopHeaderComponent;
  let fixture: ComponentFixture<AxTopHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AxTopHeaderComponent,
        MockComponent(AxPageTitleComponent),
        MockComponent(AxCurrentUserComponent),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AxTopHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
