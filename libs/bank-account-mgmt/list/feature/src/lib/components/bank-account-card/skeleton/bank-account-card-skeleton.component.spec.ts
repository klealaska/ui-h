import { BankAccountCardSkeletonComponent } from './bank-account-card-skeleton.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';

describe('bank account card skeleton', () => {
  let component: BankAccountCardSkeletonComponent;
  let fixture: ComponentFixture<BankAccountCardSkeletonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BankAccountCardSkeletonComponent],
    });
    fixture = TestBed.createComponent(BankAccountCardSkeletonComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
});
