import { PaymentContainerComponent } from './payment-container.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('payment container', () => {
  let component: PaymentContainerComponent;
  let fixture: ComponentFixture<PaymentContainerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PaymentContainerComponent],
      imports: [RouterTestingModule],
    });
    fixture = TestBed.createComponent(PaymentContainerComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
});
