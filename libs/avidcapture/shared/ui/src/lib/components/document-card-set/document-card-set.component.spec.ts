import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { AxDashboardCardSetComponent } from '@ui-coe/shared/ui';
import { MockComponent } from 'ng-mocks';

import { DocumentCardSetComponent } from './document-card-set.component';

describe('DocumentCardSetComponent', () => {
  let component: DocumentCardSetComponent;
  let fixture: ComponentFixture<DocumentCardSetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DocumentCardSetComponent, MockComponent(AxDashboardCardSetComponent)],
      imports: [MatCardModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentCardSetComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
