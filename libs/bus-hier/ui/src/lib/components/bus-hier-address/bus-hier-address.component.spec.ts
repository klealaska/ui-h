import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  AddressType,
  HierarchyType,
  IAddress,
  IEditAddressEvent,
} from '@ui-coe/bus-hier/shared/types';
import {
  ButtonComponent,
  InputComponent,
  DropdownComponent,
  SharedUiV2Module,
  SideSheetComponent,
  TagComponent,
} from '@ui-coe/shared/ui-v2';
import { ButtonColors } from 'libs/shared/types/src/lib/ui-v2';
import { BusHierAddressComponent } from './bus-hier-address.component';

describe('BusHierAddressComponent', () => {
  let component: BusHierAddressComponent;
  let fixture: ComponentFixture<BusHierAddressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BusHierAddressComponent],
      imports: [
        SharedUiV2Module,
        ButtonComponent,
        InputComponent,
        TagComponent,
        SideSheetComponent,
        NoopAnimationsModule,
        DropdownComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BusHierAddressComponent);
    component = fixture.componentInstance;
    component.deactiveWarningModalBodyText = '{{ address }} will be inactive';
    component.reActiveWarningModalBodyText = '{{ address }} will be activate';

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('onActivateOrDeactivate', () => {
    it('should open a dialogbox to deactivate an address', () => {
      const address: IAddress = {
        addressId: '1',
        isActive: true,
        addressLine1: '',
        locality: 'Foo',
        region: 'NC',
        postalCode: '',
        country: '',
        isPrimary: true,
        addressType: AddressType.BILL_TO,
        addressCode: '28277',
      };
      const spy = jest.spyOn(component['dialog'], 'open');
      component.onDeactivateActivateAddress(address);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(component.dialogData.type).toEqual('alert');
      expect(component.dialogData.actionBtn.color).toEqual(ButtonColors.critical);
    });

    it('should open a dialogbox to activate an address', () => {
      const address: IAddress = {
        addressId: '1',
        isActive: false,
        addressLine1: '',
        locality: 'Foo2',
        region: 'NC',
        postalCode: '',
        country: '',
        isPrimary: false,
        addressType: AddressType.BILL_TO,
        addressCode: '28277',
      };
      const spy = jest.spyOn(component['dialog'], 'open');
      component.onDeactivateActivateAddress(address);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(component.dialogData.type).toEqual('default');
      expect(component.dialogData.actionBtn.color).toEqual(ButtonColors.default);
    });
  });

  it('should emit editAddress when onSaveButtonClick is called', () => {
    const spy = jest.spyOn(component.editAddress, 'emit');
    component.editAddressForm.patchValue({
      addressLine1: '123 Elm Street',
      addressLine2: '',
      addressLine3: '',
      addressLine4: '',
      locality: 'New York City',
      region: 'NY',
      postalCode: '12345',
      addressType: 'fooType',
      addressCode: 'fooCode',
      country: '',
    });

    const res: IEditAddressEvent = {
      address: {
        addressId: '',
        addressLine1: '123 Elm Street',
        addressLine2: '',
        addressLine3: '',
        addressLine4: '',
        addressCode: 'fooCode',
        locality: 'New York City',
        region: 'NY',
        postalCode: '12345',
        country: '',
        isPrimary: true,
        isActive: true,
        addressType: 'fooType',
      },
      type: HierarchyType.ORGANIZATION,
      id: 'foo',
      addressType: AddressType.SHIP_TO,
    };
    component.address = {
      addressId: '',
      addressLine1: '',
      addressCode: '',
      locality: '',
      region: '',
      postalCode: '',
      country: '',
      isPrimary: true,
      isActive: true,
      addressType: '',
    };
    component.addressType = AddressType.SHIP_TO;
    component.id = 'foo';
    component.hierarchyType = HierarchyType.ORGANIZATION;
    component.onSaveButtonClick();
    expect(spy).toHaveBeenCalledWith(res);
  });
});
