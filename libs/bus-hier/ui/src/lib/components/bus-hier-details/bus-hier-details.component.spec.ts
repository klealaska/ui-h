import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HierarchyType, IDetails } from '@ui-coe/bus-hier/shared/types';
import { SharedUiV2Module, TagComponent } from '@ui-coe/shared/ui-v2';
import { ButtonColors } from 'libs/shared/types/src/lib/ui-v2';
import { BusHierUiModule } from '../../bus-hier-ui.module';
import { BusHierDetailsComponent } from './bus-hier-details.component';

describe('BusHierDetailsComponent', () => {
  let component: BusHierDetailsComponent;
  let fixture: ComponentFixture<BusHierDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BusHierDetailsComponent],
      imports: [BusHierUiModule, SharedUiV2Module, TagComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BusHierDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onActivateOrDeactivate', () => {
    it('should open a dialogbox to deactivate an item', () => {
      const item: IDetails = {
        id: '1',
        type: HierarchyType.ERP,
        name: 'foo',
        code: '123',
        status: 'Active',
        level: 1,
      };
      const spy = jest.spyOn(component['dialog'], 'open');
      component.onActivateOrDeactivateItem(item);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(component.dialogData.type).toEqual('alert');
      expect(component.dialogData.actionBtn.color).toEqual(ButtonColors.critical);
    });

    it('should open a dialogbox to activate an item', () => {
      const item: IDetails = {
        id: '1',
        type: HierarchyType.ERP,
        name: 'foo',
        code: '123',
        status: 'Inactive',
        level: 1,
      };
      const spy = jest.spyOn(component['dialog'], 'open');
      component.onActivateOrDeactivateItem(item);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(component.dialogData.type).toEqual('default');
      expect(component.dialogData.actionBtn.color).toEqual(ButtonColors.default);
    });
  });
});
