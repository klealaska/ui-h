import { SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ButtonComponent } from '@ui-coe/shared/ui-v2';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';

import { formGroupInstanceHomeStub, getBuyersStub } from '../../../../../testing/test-stubs';
import { HomePanelComponent } from './home-panel.component';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';

const dialogStub = {
  open: jest.fn(),
  closeAll: jest.fn(),
};

describe('HomePanelComponent', () => {
  let component: HomePanelComponent;
  let fixture: ComponentFixture<HomePanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomePanelComponent, MockComponent(ButtonComponent)],
      imports: [
        NoopAnimationsModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatCardModule,
        MatExpansionModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatRadioModule,
        MatSelectModule,
        MatSlideToggleModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
      ],
      providers: [{ provide: MatDialog, useValue: dialogStub }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomePanelComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => jest.clearAllMocks());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit()', () => {
    const buyerStub = getBuyersStub()[0];

    describe('when portalStatus is Active', () => {
      beforeEach(() => {
        component.buyer = buyerStub;
        fixture.detectChanges();
      });

      it('should set buyerKeywordForm with values from buyer with portalStatus as true', () => {
        expect(component.buyerKeywordForm.value).toEqual({
          sourceSystemBuyerId: buyerStub.sourceSystemBuyerId,
          indexingSolutionId: buyerStub.indexingSolutionId,
          portalStatus: true,
          forwardingEmailAddress: buyerStub.forwardingEmailAddress,
          bounceBackMessage: buyerStub.bounceBackMessage,
          displayPredictedValues: false,
          buyerKeyword: 'avid',
          buyerKeywordId: '264',
          ingestionMethodId: '1',
          sourceSystemId: 'Invoice',
          displayIdentifierSearchValues: false,
        });
      });
    });

    describe('when portalStatus is Inactive', () => {
      beforeEach(() => {
        component.buyer = buyerStub;
        component.buyer.portalStatus = 'Inactive';
        fixture.detectChanges();
      });

      it('should set buyerKeywordForm with values from buyer with portalStatus as false', () => {
        expect(component.buyerKeywordForm.value).toEqual({
          sourceSystemBuyerId: buyerStub.sourceSystemBuyerId,
          indexingSolutionId: buyerStub.indexingSolutionId,
          portalStatus: false,
          forwardingEmailAddress: buyerStub.forwardingEmailAddress,
          bounceBackMessage: buyerStub.bounceBackMessage,
          displayPredictedValues: false,
          buyerKeyword: 'avid',
          buyerKeywordId: '264',
          ingestionMethodId: '1',
          sourceSystemId: 'Invoice',
          displayIdentifierSearchValues: false,
        });
      });
    });

    describe('when displayPredictedValues is true', () => {
      beforeEach(() => {
        component.buyer = buyerStub;
        component.buyer.displayPredictedValues = '1';
        fixture.detectChanges();
      });

      it('should set buyerKeywordForm with values from buyer with portalStatus as false', () => {
        expect(component.buyerKeywordForm.value).toEqual({
          sourceSystemBuyerId: buyerStub.sourceSystemBuyerId,
          indexingSolutionId: buyerStub.indexingSolutionId,
          portalStatus: false,
          forwardingEmailAddress: buyerStub.forwardingEmailAddress,
          bounceBackMessage: buyerStub.bounceBackMessage,
          displayPredictedValues: true,
          buyerKeyword: 'avid',
          buyerKeywordId: '264',
          ingestionMethodId: '1',
          sourceSystemId: 'Invoice',
          displayIdentifierSearchValues: false,
        });
      });
    });

    describe('when displayIdentifierSearchValues is true', () => {
      beforeEach(() => {
        component.buyer = buyerStub;
        component.buyer.displayIdentifierSearchValues = '1';
        fixture.detectChanges();
      });

      it('should set buyerKeywordForm with values from buyer with displayIdentifierSearchValues as true', () => {
        expect(component.buyerKeywordForm.value).toEqual({
          sourceSystemBuyerId: buyerStub.sourceSystemBuyerId,
          indexingSolutionId: buyerStub.indexingSolutionId,
          portalStatus: false,
          forwardingEmailAddress: buyerStub.forwardingEmailAddress,
          bounceBackMessage: buyerStub.bounceBackMessage,
          displayPredictedValues: true,
          buyerKeyword: 'avid',
          buyerKeywordId: '264',
          ingestionMethodId: '1',
          sourceSystemId: 'Invoice',
          displayIdentifierSearchValues: true,
        });
      });
    });
  });

  describe('ngOnChanges()', () => {
    describe('for resetForm changes', () => {
      const buyerStub = getBuyersStub()[0];

      describe('when resetForm change is TRUE', () => {
        beforeEach(() => {
          jest.spyOn(component.updateFormStatus, 'emit').mockImplementation();
          component.buyer = buyerStub;
          fixture.detectChanges();

          component.buyerKeywordForm.markAsDirty();

          component.ngOnChanges({
            resetForm: new SimpleChange(null, true, true),
          });
        });

        it('should mark the buyerkeyword form as pristine', () =>
          expect(component.buyerKeywordForm.pristine).toBeTruthy());

        it('should emit false for updateFormStatus', () =>
          expect(component.updateFormStatus.emit).toHaveBeenNthCalledWith(1, false));
      });

      describe('when resetForm change is FALSE', () => {
        beforeEach(() => {
          jest.spyOn(component.updateFormStatus, 'emit').mockImplementation();
          component.buyer = buyerStub;
          fixture.detectChanges();

          component.buyerKeywordForm.markAsDirty();

          component.ngOnChanges({
            resetForm: new SimpleChange(null, false, true),
          });
        });

        it('should NOT mark the buyerkeyword form as pristine', () =>
          expect(component.buyerKeywordForm.pristine).toBeFalsy());

        it('should NOT emit false for updateFormStatus', () =>
          expect(component.updateFormStatus.emit).not.toHaveBeenCalled());
      });

      describe('when resetForm change is NULL', () => {
        beforeEach(() => {
          jest.spyOn(component.updateFormStatus, 'emit').mockImplementation();
          component.buyer = buyerStub;
          fixture.detectChanges();

          component.buyerKeywordForm.markAsDirty();

          component.ngOnChanges({
            mock: new SimpleChange(null, null, true),
          });
        });

        it('should NOT mark the buyerkeyword form as pristine', () =>
          expect(component.buyerKeywordForm.pristine).toBeFalsy());

        it('should NOT emit false for updateFormStatus', () =>
          expect(component.updateFormStatus.emit).not.toHaveBeenCalled());
      });
    });
  });

  describe('massVoid', () => {
    describe('When confirm mass void modal returns true', () => {
      beforeEach(() => {
        dialogStub.open.mockReturnValue({ afterClosed: () => of(true) });
        jest.spyOn(component.executeMassVoid, 'emit');
        component.buyerKeywordForm = formGroupInstanceHomeStub;
        component.massVoid('mockBuyerName');
      });

      it('should emit executeMassVoid', () => {
        expect(component.executeMassVoid.emit).toHaveBeenCalled();
      });
    });
  });
});
