import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusHierListComponent } from './bus-hier-list.component';
import { ButtonComponent, InputComponent, SideSheetComponent } from '@ui-coe/shared/ui-v2';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

describe('BusHierListComponent', () => {
  let component: BusHierListComponent;
  let fixture: ComponentFixture<BusHierListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BusHierListComponent],
      imports: [
        InputComponent,
        BrowserAnimationsModule,
        SideSheetComponent,
        ReactiveFormsModule,
        ButtonComponent,
        MatIconModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BusHierListComponent);
    component = fixture.componentInstance;
    component.errors = ['error'];

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
