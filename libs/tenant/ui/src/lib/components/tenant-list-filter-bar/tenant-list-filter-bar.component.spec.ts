import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InputComponent, SharedUiV2Module, TableComponent } from '@ui-coe/shared/ui-v2';

import { TenantListFilterBarComponent } from './tenant-list-filter-bar.component';

describe('TenantListFilterBarComponent', () => {
  let component: TenantListFilterBarComponent;
  let fixture: ComponentFixture<TenantListFilterBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TenantListFilterBarComponent],
      imports: [
        ReactiveFormsModule,
        SharedUiV2Module,
        BrowserAnimationsModule,
        TableComponent,
        InputComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TenantListFilterBarComponent);
    component = fixture.componentInstance;
    component.nameFieldValue = 'foo';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit filterValue with nameField', done => {
    const spyFilterValueEmit = jest.spyOn(component.filterValue, 'emit');
    component.ngOnInit();
    component.formGroup.get('nameField').setValue('foo');
    setTimeout(() => {
      expect(spyFilterValueEmit).toBeCalledWith({ siteName: 'foo' });
      done();
    }, 300);
  });
});
