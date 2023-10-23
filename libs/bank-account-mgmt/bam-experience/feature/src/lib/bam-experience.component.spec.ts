import { BamExperienceComponent } from './bam-experience.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import {
  BankAccountSharedFacade,
  HeaderService,
} from '@ui-coe/bank-account-mgmt/shared/data-access';
import {
  bankAccountSharedFacadeMock,
  headerServiceMock,
} from '@ui-coe/bank-account-mgmt/shared/test';
import { of } from 'rxjs';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('bank account container', () => {
  let component: BamExperienceComponent;
  let fixture: ComponentFixture<BamExperienceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BamExperienceComponent],
      imports: [RouterTestingModule],
      providers: [
        { provide: HeaderService, useValue: headerServiceMock },
        { provide: BankAccountSharedFacade, useValue: bankAccountSharedFacadeMock },
      ],
    });
    fixture = TestBed.createComponent(BamExperienceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('add side panel', () => {
    let addComponentElem: DebugElement;

    beforeEach(() => {
      component.sidePanelComponentId$ = of('add');
      fixture.detectChanges();
      addComponentElem = fixture.debugElement.query(By.css('ax-bank-account-add'));
    });

    it('should display the add component in the side sheet', () => {
      expect(addComponentElem).toBeTruthy();
    });
  });

  describe('detail side panel', () => {
    let detailComponentElem: DebugElement;

    beforeEach(() => {
      component.sidePanelComponentId$ = of('detail');
      fixture.detectChanges();

      detailComponentElem = fixture.debugElement.query(By.css('ax-bank-account-detail-container'));
    });

    it('should display the add component in the side sheet', () => {
      expect(detailComponentElem).toBeTruthy();
    });
  });

  describe('edit side panel', () => {
    let editComponentElem: DebugElement;

    beforeEach(() => {
      component.sidePanelComponentId$ = of('edit');
      fixture.detectChanges();

      editComponentElem = fixture.debugElement.query(By.css('ax-bank-account-edit-container'));
    });

    it('should display the edit component in the side sheet', () => {
      expect(editComponentElem).toBeTruthy();
    });
  });
});
