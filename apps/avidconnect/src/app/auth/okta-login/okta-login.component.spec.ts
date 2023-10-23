import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OktaLoginComponent } from './okta-login.component';

describe('OktaLoginComponent', () => {
  let component: OktaLoginComponent;
  let fixture: ComponentFixture<OktaLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OktaLoginComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OktaLoginComponent);
    component = fixture.componentInstance;
    component.config = {
      baseUrl: 'fakeUrl',
      clientId: 'fakeClientId',
      redirectUri: 'fakeRedirectUri',
      authParams: {
        issuer: 'fakeIssuer',
        pkce: true,
      },
    };
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
