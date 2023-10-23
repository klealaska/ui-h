import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DomSanitizer } from '@angular/platform-browser';
import { connectorServiceStub, domSanitizerStub } from '../../../../test/test-stubs';
import { ConnectorService } from '../../../core/services/connector.service';

import { LogoComponent } from './logo.component';

describe('LogoComponent', () => {
  let component: LogoComponent;
  let fixture: ComponentFixture<LogoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LogoComponent],
      providers: [
        {
          provide: DomSanitizer,
          useValue: domSanitizerStub,
        },
        {
          provide: ConnectorService,
          useValue: connectorServiceStub,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LogoComponent);
    component = fixture.componentInstance;
    component.connectorId = 1;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit()', () => {
    it('should get connector logo from service', () => {
      expect(connectorServiceStub.getLogo).toHaveBeenNthCalledWith(1, 1);
    });
  });
});
