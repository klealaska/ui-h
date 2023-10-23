import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIcon, MatIconRegistry } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { DomSanitizer } from '@angular/platform-browser';
import { MockComponent } from 'ng-mocks';

import { domSantizerStub, iconRegistryStub } from '../../../testing/test-stubs';
import { IconComponent } from './icon.component';

describe('IconComponent', () => {
  let component: IconComponent;
  let fixture: ComponentFixture<IconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IconComponent, MockComponent(MatIcon)],
      imports: [MatBadgeModule],
      providers: [
        {
          provide: DomSanitizer,
          useValue: domSantizerStub,
        },
        {
          provide: MatIconRegistry,
          useValue: iconRegistryStub,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IconComponent);
    component = fixture.componentInstance;
    component.svgData = 'mockSvgData';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set svg to mockSvgData', () => expect(component.svg).toBe('mockSvgData'));

  describe('ngOnInit()', () => {
    describe('when id is provided by the input', () => {
      beforeEach(() => {
        component.id = '1';
        fixture.detectChanges();
      });

      it('should set id to the input given', () => expect(component.id).toBe('1'));
    });

    describe('when id is not provided by the input', () => {
      beforeEach(() => {
        fixture.detectChanges();
      });

      it('should set id to ax-mat-icon-timestamp', () =>
        expect(component.id).toContain(`ax-mat-icon-`));
    });
  });
});
