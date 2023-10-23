import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BankAccountAddSkeletonComponent } from './bank-account-add-skeleton.component';

describe('add bank account skeleton', () => {
  let component: BankAccountAddSkeletonComponent;
  let fixture: ComponentFixture<BankAccountAddSkeletonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BankAccountAddSkeletonComponent],
    });
    fixture = TestBed.createComponent(BankAccountAddSkeletonComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
});
