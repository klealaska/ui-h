import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { MockComponent } from 'ng-mocks';

import { AxIconComponent } from '../../atoms/ax-icon/ax-icon.component';
import { AxLabelComponent } from '../../atoms/ax-label/ax-label.component';
import { MenuComponent } from '../../material/menu/menu.component';
import { AxCurrentUserComponent } from './ax-current-user.component';

describe('AxCurrentUserComponent', () => {
  let component: AxCurrentUserComponent;
  let fixture: ComponentFixture<AxCurrentUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AxCurrentUserComponent,
        MockComponent(AxIconComponent),
        MockComponent(AxLabelComponent),
        MockComponent(MenuComponent),
      ],
      imports: [MatIconModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AxCurrentUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
