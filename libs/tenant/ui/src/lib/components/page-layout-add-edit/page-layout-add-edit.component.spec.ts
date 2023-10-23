import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { SharedUtilDirectivesModule } from '@ui-coe/shared/util/directives';

import { PageLayoutAddEditComponent } from './page-layout-add-edit.component';

describe('PageLayoutAddEditComponent', () => {
  let component: PageLayoutAddEditComponent;
  let fixture: ComponentFixture<PageLayoutAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PageLayoutAddEditComponent],
      imports: [SharedUtilDirectivesModule, MatIconModule, MatCardModule],
    }).compileComponents();

    fixture = TestBed.createComponent(PageLayoutAddEditComponent);
    component = fixture.componentInstance;
    component.sections = [];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
