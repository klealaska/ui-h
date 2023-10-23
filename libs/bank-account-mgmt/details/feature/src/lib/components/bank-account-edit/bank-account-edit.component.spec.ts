import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankAccountEditComponent } from './bank-account-edit.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('BankAccountEditComponent', () => {
  let component: BankAccountEditComponent;
  let fixture: ComponentFixture<BankAccountEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BankAccountEditComponent, NoopAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(BankAccountEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit a nicknameChange event with trimmed name when the value is changed', () => {
    jest.spyOn(component.nicknameChange, 'emit');
    component.nicknameControl.setValue('   new name   ');
    expect(component.nicknameChange.emit).toHaveBeenCalledWith('new name');
  });
});
