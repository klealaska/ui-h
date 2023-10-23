import { BankAccountListSkeletonComponent } from './bank-account-list-skeleton.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';

describe('bam list skeleton', () => {
  let component: BankAccountListSkeletonComponent;
  let fixture: ComponentFixture<BankAccountListSkeletonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BankAccountListSkeletonComponent],
    });

    fixture = TestBed.createComponent(BankAccountListSkeletonComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
});
