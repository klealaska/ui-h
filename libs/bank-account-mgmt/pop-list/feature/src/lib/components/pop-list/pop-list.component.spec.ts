import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopListComponent } from './pop-list.component';
import { TableComponent } from '@ui-coe/shared/ui-v2';
import { bankAccountListMock, popBamListMock } from '@ui-coe/bank-account-mgmt/shared/test';
import { SimpleChange } from '@angular/core';
import { MatTableModule } from '@angular/material/table';

describe('PopListComponent', () => {
  let component: PopListComponent;
  let fixture: ComponentFixture<PopListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PopListComponent],
      imports: [MatTableModule, TableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PopListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should define datasource', () => {
    const defineSpy = jest.spyOn(component, 'defineDatasource');
    component.ngOnChanges({
      accounts: new SimpleChange(null, bankAccountListMock, null),
    });
    fixture.detectChanges();
    expect(defineSpy).toHaveBeenCalled();
    expect(component.dataSource$.value.data).toEqual(popBamListMock);
  });
});
