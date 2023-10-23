import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';

import { AxImageComponent } from '../../atoms/ax-image/ax-image.component';
import { AxLabelComponent } from '../../atoms/ax-label/ax-label.component';
import { AxPageTitleComponent } from './ax-page-title.component';

describe('AxPageTitleComponent', () => {
  let component: AxPageTitleComponent;
  let fixture: ComponentFixture<AxPageTitleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AxPageTitleComponent,
        MockComponent(AxImageComponent),
        MockComponent(AxLabelComponent),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AxPageTitleComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getImageDimensions on init', () => {
    jest.spyOn(component as any, 'getImageDimensions').mockImplementation();
    fixture.detectChanges();
    expect(component['getImageDimensions']).toHaveBeenCalledTimes(1);
  });

  describe('onTitleClick()', () => {
    describe('when canClickTitle is true', () => {
      beforeEach(() => {
        jest.spyOn(component.titleClick, 'emit').mockImplementation();
        component.canClickTitle = true;
        component.onTitleClick();
      });

      it('should emit for titleClick', () =>
        expect(component.titleClick.emit).toHaveBeenCalledTimes(1));
    });
    describe('when canClickTitle is false', () => {
      beforeEach(() => {
        jest.spyOn(component.titleClick, 'emit').mockImplementation();
        component.canClickTitle = false;
        component.onTitleClick();
      });

      it('should NOT emit for titleClick', () =>
        expect(component.titleClick.emit).not.toHaveBeenCalled());
    });
  });

  describe('private getImageDimensions()', () => {
    describe('when avidPartner is for AvidXChange users', () => {
      beforeEach(() => {
        component.avidPartner = 'avid';
        component['getImageDimensions']();
      });

      it('should set image height & width', () => {
        expect(component.imageHeight).toBe(58);
        expect(component.imageWidth).toBe(45);
      });
    });

    describe('when avidPartner is for Bank of America users', () => {
      beforeEach(() => {
        component.avidPartner = 'bofa';
        component['getImageDimensions']();
      });

      it('should set image height & width', () => {
        expect(component.imageHeight).toBe(58);
        expect(component.imageWidth).toBe(350);
      });
    });

    describe('when avidPartner is for Com Data users', () => {
      beforeEach(() => {
        component.avidPartner = 'comdata';
        component['getImageDimensions']();
      });

      it('should set image height & width', () => {
        expect(component.imageHeight).toBe(55);
        expect(component.imageWidth).toBe(185);
      });
    });

    describe('when avidPartner is for Fifth Third Bank users', () => {
      beforeEach(() => {
        component.avidPartner = 'fifththird';
        component['getImageDimensions']();
      });

      it('should set image height & width', () => {
        expect(component.imageHeight).toBe(58);
        expect(component.imageWidth).toBe(350);
      });
    });

    describe('when avidPartner is for Key Bank users', () => {
      beforeEach(() => {
        component.avidPartner = 'keybank';
        component['getImageDimensions']();
      });

      it('should set image height & width', () => {
        expect(component.imageHeight).toBe(58);
        expect(component.imageWidth).toBe(350);
      });
    });

    describe('when avidPartner is not found', () => {
      beforeEach(() => {
        component.avidPartner = '';
        component['getImageDimensions']();
      });

      it('should set image height & width', () => {
        expect(component.imageHeight).toBe(58);
        expect(component.imageWidth).toBe(58);
      });
    });
  });
});
