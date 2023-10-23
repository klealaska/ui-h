import { BankAccountHeaderContainerComponent } from './bank-account-header-container.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';

describe('bank account header container', () => {
  let component: BankAccountHeaderContainerComponent;
  let fixture: ComponentFixture<BankAccountHeaderContainerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BankAccountHeaderContainerComponent],
    });
    fixture = TestBed.createComponent(BankAccountHeaderContainerComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
});
