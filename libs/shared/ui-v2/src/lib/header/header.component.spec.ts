import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderComponent } from './header.component';
import { HeaderNavAvatarInput } from '@ui-coe/shared/types';
import { By } from '@angular/platform-browser';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create button', () => {
    const avatarInput: HeaderNavAvatarInput = {
      img: 'https://www.fillmurray.com/140/140',
      name: { first: '', last: '' },
    };
    component.avatarInput = avatarInput;
    fixture.detectChanges();
    const items = fixture.debugElement.queryAll(By.css('.avatar-button'));
    expect(items.length).toEqual(1);
  });

  it('should send event', () => {
    const avatarInput: HeaderNavAvatarInput = {
      img: 'https://www.fillmurray.com/140/140',
      name: { first: '', last: '' },
    };
    component.avatarInput = avatarInput;

    const spy = jest.spyOn(component.userClick, 'emit');
    component.userClick.emit();
    fixture.detectChanges();
    expect(spy).toBeCalled();
  });
});
