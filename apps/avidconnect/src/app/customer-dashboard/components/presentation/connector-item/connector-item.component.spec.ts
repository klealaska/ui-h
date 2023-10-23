import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LogoComponent } from '../../../../shared/components/logo/logo.component';
import { MockComponents } from 'ng-mocks';
import { connectorItemStub } from '../../../../../test/test-stubs';

import { ConnectorItemComponent } from './connector-item.component';
import { AccountingSystemComponent } from '../accounting-system/accounting-system.component';

describe('ConnectorItemComponent', () => {
  let component: ConnectorItemComponent;
  let fixture: ComponentFixture<ConnectorItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ConnectorItemComponent,
        MockComponents(LogoComponent, AccountingSystemComponent),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectorItemComponent);
    component = fixture.componentInstance;
    component.connector = connectorItemStub;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
