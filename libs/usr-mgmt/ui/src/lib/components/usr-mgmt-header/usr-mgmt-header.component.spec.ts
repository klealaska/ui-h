import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsrMgmtHeaderComponent } from './usr-mgmt-header.component';
import { UsrMgmtUiModule } from '../../usr-mgmt-ui.module';

describe('UsrMgmtHeaderComponent', () => {
  let component: UsrMgmtHeaderComponent;
  let fixture: ComponentFixture<UsrMgmtHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UsrMgmtHeaderComponent],
      imports: [UsrMgmtUiModule],
    }).compileComponents();

    fixture = TestBed.createComponent(UsrMgmtHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
