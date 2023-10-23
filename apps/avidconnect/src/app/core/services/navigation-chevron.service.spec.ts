import { TestBed } from '@angular/core/testing';
import { Store } from '@ngxs/store';
import {
  connectorStub,
  customerStub,
  operationStub,
  platformStub,
  registrationStub,
  storeStub,
} from '../../../test/test-stubs';
import { AvidPage } from '../enums';

import { NavigationChevronService } from './navigation-chevron.service';

describe('NavigationChevronService', () => {
  let service: NavigationChevronService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: Store, useValue: storeStub }],
    });
    service = TestBed.inject(NavigationChevronService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getNavigationChevron()', () => {
    let output;

    const baseNavigation = [
      { title: platformStub.name, tooltip: 'Platform' },
      { title: customerStub.name, url: '/customer-dashboard/activity' },
    ];

    describe('when information objects exist', () => {
      beforeEach(() => {
        jest
          .spyOn(storeStub, 'selectSnapshot')
          .mockReturnValueOnce(customerStub)
          .mockReturnValueOnce(platformStub)
          .mockReturnValueOnce(registrationStub)
          .mockReturnValueOnce(connectorStub)
          .mockReturnValueOnce(operationStub);
      });
      describe('CustomerRecentActivity', () => {
        beforeEach(() => {
          output = service.getNavigationChevron(AvidPage.CustomerRecentActivity);
        });

        it('should return path tree for navigation chevron', () =>
          expect(output).toEqual([
            { title: platformStub.name, tooltip: 'Platform' },
            { title: customerStub.name },
            { title: 'Recent Activity' },
          ]));
      });

      describe('CustomerConnectors', () => {
        beforeEach(() => {
          output = service.getNavigationChevron(AvidPage.CustomerConnectors);
        });

        it('should return path tree for navigation chevron', () =>
          expect(output).toEqual([...baseNavigation, { title: 'Connectors' }]));
      });

      describe('CustomerConnectors', () => {
        beforeEach(() => {
          output = service.getNavigationChevron(AvidPage.CustomerConnectors);
        });

        it('should return path tree for navigation chevron', () =>
          expect(output).toEqual([...baseNavigation, { title: 'Connectors' }]));
      });

      describe('CustomerDataSelection', () => {
        beforeEach(() => {
          output = service.getNavigationChevron(AvidPage.CustomerDataSelection);
        });

        it('should return path tree for navigation chevron', () =>
          expect(output).toEqual([
            ...baseNavigation,
            { title: 'Data Selections' },
            { title: registrationStub.description, tooltip: 'Accounting system' },
          ]));
      });

      describe('CustomerScheduleSync', () => {
        beforeEach(() => {
          output = service.getNavigationChevron(AvidPage.CustomerScheduleSync);
        });

        it('should return path tree for navigation chevron', () =>
          expect(output).toEqual([
            ...baseNavigation,
            { title: 'Schedule Sync' },
            { title: registrationStub.description, tooltip: 'Accounting system' },
          ]));
      });

      describe('CustomerSync', () => {
        beforeEach(() => {
          output = service.getNavigationChevron(AvidPage.CustomerSync);
        });

        it('should return path tree for navigation chevron', () =>
          expect(output).toEqual([
            ...baseNavigation,
            { title: 'Sync Now' },
            { title: registrationStub.description, tooltip: 'Accounting system' },
          ]));
      });

      describe('CustomerSettings', () => {
        beforeEach(() => {
          output = service.getNavigationChevron(AvidPage.CustomerSettings);
        });

        it('should return path tree for navigation chevron', () =>
          expect(output).toEqual([
            ...baseNavigation,
            { title: 'Settings' },
            {
              title: registrationStub.description,
              tooltip: 'Accounting system',
            },
          ]));
      });

      describe('OperationDetails', () => {
        beforeEach(() => {
          output = service.getNavigationChevron(AvidPage.OperationDetails);
        });

        it('should return path tree for navigation chevron', () =>
          expect(output).toEqual([
            ...baseNavigation,
            {
              title: 'Operation Details',
            },
            {
              title: operationStub.registrationDescription,
              tooltip: 'Accounting system',
            },
            {
              title: operationStub.id.toString(),
              tooltip: 'Operation ID',
            },
          ]));
      });

      describe('default', () => {
        beforeEach(() => {
          output = service.getNavigationChevron(null);
        });

        it('should return empty array', () => expect(output).toEqual([]));
      });
    });

    describe('when information objects are null', () => {
      beforeEach(() => {
        jest
          .spyOn(storeStub, 'selectSnapshot')
          .mockReturnValueOnce(null)
          .mockReturnValueOnce(null)
          .mockReturnValueOnce(null)
          .mockReturnValueOnce(null)
          .mockReturnValueOnce(null);
      });

      describe('CustomerDataSelection', () => {
        beforeEach(() => {
          output = service.getNavigationChevron(AvidPage.CustomerDataSelection);
        });

        it('should return path tree for navigation chevron', () => expect(output).toEqual([]));
      });

      describe('CustomerScheduleSync', () => {
        beforeEach(() => {
          output = service.getNavigationChevron(AvidPage.CustomerScheduleSync);
        });

        it('should return path tree for navigation chevron', () => expect(output).toEqual([]));
      });

      describe('CustomerSync', () => {
        beforeEach(() => {
          output = service.getNavigationChevron(AvidPage.CustomerSync);
        });

        it('should return path tree for navigation chevron', () => expect(output).toEqual([]));
      });

      describe('CustomerSettings', () => {
        beforeEach(() => {
          output = service.getNavigationChevron(AvidPage.CustomerSettings);
        });

        it('should return path tree for navigation chevron', () => expect(output).toEqual([]));
      });

      describe('OperationDetails', () => {
        beforeEach(() => {
          output = service.getNavigationChevron(AvidPage.OperationDetails);
        });

        it('should return path tree for navigation chevron', () => expect(output).toEqual([]));
      });
    });
  });
});
