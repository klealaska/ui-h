import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { NgxsModule } from '@ngxs/store';
import { routerStub } from '../../../../test/test-stubs';

import { PageHeaderComponent } from './page-header.component';

describe('PageHeaderComponent', () => {
  let component: PageHeaderComponent;
  let fixture: ComponentFixture<PageHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PageHeaderComponent],
      imports: [NgxsModule.forRoot([])],
      providers: [
        {
          provide: Router,
          useValue: routerStub,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PageHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('goBack()', () => {
    describe('when backUrl is defined', () => {
      beforeEach(() => {
        jest.spyOn(window.history, 'back');
        component.backUrl = '/url';
        component.goBack();
      });
      it('should navigate to backUrl', () =>
        expect(routerStub.navigate).toHaveBeenCalledWith(['/url']));
    });

    describe('when backUrl is not defined', () => {
      beforeEach(() => {
        jest.spyOn(window.history, 'back');
        component.goBack();
      });
      it('should go to previous page on windows history list', () =>
        expect(window.history.back).toHaveBeenCalled());
    });
  });

  describe('navigateTo()', () => {
    afterEach(() => jest.clearAllMocks());
    describe('when url is provided', () => {
      beforeEach(() => {
        component.navigateTo('/url');
      });

      it('should navigate to provided route', () => {
        expect(routerStub.navigate).toHaveBeenCalledWith(['/url']);
      });
    });

    describe('when url is not provided', () => {
      beforeEach(() => {
        component.navigateTo('');
      });

      it('should not navigate', () => {
        expect(routerStub.navigate).not.toHaveBeenCalled();
      });
    });
  });
});
