import { ElementRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { TranslatePipe } from '@ngx-translate/core';
import { NgxsModule, Store } from '@ngxs/store';
import { MenuOptions } from '@ui-coe/avidcapture/shared/types';
import { SlideToggleComponent, TooltipDirective } from '@ui-coe/shared/ui-v2';
import { MockDirective, MockPipe } from 'ng-mocks';

import { DocumentCommandBarComponent } from './document-command-bar.component';

const numberKeys: string[] = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
const notNumberKeys: string[] = ['a', 'b', 'c', '!', '@', '#'];

describe('DocumentCommandBarComponent', () => {
  let component: DocumentCommandBarComponent;
  let fixture: ComponentFixture<DocumentCommandBarComponent>;
  let store: Store;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        DocumentCommandBarComponent,
        MockDirective(TooltipDirective),
        MockPipe(TranslatePipe),
      ],
      imports: [
        SlideToggleComponent,
        MatIconModule,
        MatMenuModule,
        NgxsModule.forRoot([], {
          developmentMode: true,
        }),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentCommandBarComponent);
    store = TestBed.inject(Store);
    component = fixture.componentInstance;

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    component.pageNumberInput = new ElementRef({ focus(): void {}, select(): void {}, value: '' });

    jest.spyOn(store, 'dispatch');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit()', () => {
    it('should add disableHighlight menu item when isArchivePage is TRUE', () => {
      component.isArchivePage = false;
      component.highlightToggle = false;
      fixture.detectChanges();

      expect(component.menuOptions[0]).toMatchObject({
        text: MenuOptions.Highlight,
        selectable: true,
        value: false,
      });
    });

    it('should NOT add disableHighlight menu item when isArchivePage is FALSE', () => {
      component.isArchivePage = false;
      fixture.detectChanges();

      expect(component.menuOptions[0]).toMatchObject({
        text: MenuOptions.Highlight,
        selectable: true,
        value: false,
      });

      expect(component.menuOptions.length).toBe(2);
    });
  });

  describe('selectedMenuItemChanged()', () => {
    describe('when a selected menu item changes', () => {
      describe('when Menu option is updateFontFace', () => {
        beforeEach(() => {
          jest.spyOn(component.updateFontFace, 'emit').mockImplementation();
          component.selectedMenuItemChanged(true, MenuOptions.AdjustFont);
        });

        it('should emit updateFontFace EventEmitter', () =>
          expect(component.updateFontFace.emit).toHaveBeenCalled());
      });

      describe('when Menu option is disableHighlight', () => {
        beforeEach(() => {
          jest.spyOn(component.disableHighlight, 'emit').mockImplementation();
          component.selectedMenuItemChanged(true, MenuOptions.Highlight);
        });

        it('should emit disableHighlight EventEmitter', () =>
          expect(component.disableHighlight.emit).toHaveBeenCalled());
      });
    });
  });

  describe('numberCheck()', () => {
    notNumberKeys.forEach(key => {
      describe(`when key is ${key}`, () => {
        const keyboardEventStub = {
          key,
          preventDefault: jest.fn(),
        } as any;
        let returnedValue: boolean;

        beforeEach(() => {
          returnedValue = component.numberCheck(keyboardEventStub);
        });

        it('should return false', () => expect(returnedValue).toBeFalsy());

        it('should call preventDefault', () =>
          expect(keyboardEventStub.preventDefault).toHaveBeenCalledTimes(1));
      });
    });

    numberKeys.forEach(key => {
      describe(`when key is ${key}`, () => {
        const keyboardEventStub = {
          key,
          preventDefault: jest.fn(),
        } as any;
        let returnedValue: boolean;

        beforeEach(() => {
          returnedValue = component.numberCheck(keyboardEventStub);
        });

        it('should return true', () => expect(returnedValue).toBeTruthy());

        it('should NOT call preventDefault', () =>
          expect(keyboardEventStub.preventDefault).not.toHaveBeenCalled());
      });
    });
  });

  describe('focusOut()', () => {
    beforeEach(() => {
      component.currentPage = 5;
      component.focusOut();
    });

    it('should set input value back to currentPage', () => {
      expect(component.pageNumberInput.nativeElement.value).toBe(5);
    });
  });
});
