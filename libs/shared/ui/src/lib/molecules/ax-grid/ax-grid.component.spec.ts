import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';

import { AxLabelComponent } from '../../atoms/ax-label/ax-label.component';
import { AxGridComponent } from './ax-grid.component';

describe('AxGridComponent', () => {
  let component: AxGridComponent;
  let fixture: ComponentFixture<AxGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AxGridComponent, MockComponent(AxLabelComponent)],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AxGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('loadMoreClick()', () => {
    beforeEach(() => {
      jest.spyOn(component.loadMoreData, 'next').mockImplementation();
      component.loadMoreClick();
    });

    it('should fire Subject next function', () =>
      expect(component.loadMoreData.next).toHaveBeenCalled());
  });

  describe('hideLoadMore()', () => {
    describe('when true is passed in', () => {
      beforeEach(() => {
        component.hideLoadMore(true);
      });

      it('should hide loadmore', () => expect(component.loadMoreHidden).toBeTruthy());
    });

    describe('when no parameter is passed in', () => {
      beforeEach(() => {
        component.hideLoadMore();
      });

      it('should not hide loadmore', () => expect(component.loadMoreHidden).toBeFalsy());
    });
  });

  describe('customButtonClick()', () => {
    beforeEach(() => {
      jest.spyOn(component.customButtonEvent, 'emit').mockImplementation();
      component.customButtonClick('any value');
    });

    it('should emit an any event value for customButtonEvent', () =>
      expect(component.customButtonEvent.emit).toHaveBeenCalledWith('any value'));
  });
});
