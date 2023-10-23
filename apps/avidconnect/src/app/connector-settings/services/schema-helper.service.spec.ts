import { complexStub, propertyStub, storeStub } from '../../../test/test-stubs';
import { PropertyType } from '../../core/enums';
import { ComplexType, Property } from '../../models';
import { SchemaHelperService } from './schema-helper.service';
import * as actions from '../connector-settings.actions';

describe('SchemaHelperService', () => {
  const schemaHelper = new SchemaHelperService(storeStub as any);

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validatePropertyValue()', () => {
    let isValid: boolean;

    describe('validate array values', () => {
      beforeEach(() => {
        const property: Property = {
          ...propertyStub,
          IsArray: true,
        };

        const value = ['foo', 'bar'];
        isValid = schemaHelper.validatePropertyValue('groupName', property, value);
      });

      it('should validate array values', () => expect(isValid).toBe(true));
    });

    describe('do not validate Boolean type properties', () => {
      beforeEach(() => {
        const property: Property = {
          ...propertyStub,
          Type: PropertyType.Boolean,
        };
        isValid = true;
        isValid = schemaHelper.validatePropertyValue('groupName', property, false);
      });

      it('shoul not validate property value', () => expect(isValid).toBe(true));
    });

    describe('validate IsRequired', () => {
      beforeEach(() => {
        const property: Property = {
          ...propertyStub,
          IsRequired: true,
        };

        isValid = schemaHelper.validatePropertyValue('groupName', property, '');
      });

      it('should validate if property is empty', () => expect(isValid).toBe(false));
    });

    describe('validate FormatMask', () => {
      beforeEach(() => {
        const property: Property = {
          ...propertyStub,
          //eslint-disable-next-line
          FormatMask: '/^d+$/',
        };

        isValid = schemaHelper.validatePropertyValue('groupName', property, 'abc');
      });

      it('should validate if property regex is not valid', () => expect(isValid).toBe(false));
    });

    describe('validate MinLength ', () => {
      beforeEach(() => {
        const property: Property = {
          ...propertyStub,
          MinLength: 20,
        };

        isValid = schemaHelper.validatePropertyValue('groupName', property, 'test');
      });

      it('should validate if property is not valid', () => expect(isValid).toBe(false));
    });

    describe('validate MaxLength ', () => {
      beforeEach(() => {
        const property: Property = {
          ...propertyStub,
          MaxLength: null,
        };

        isValid = schemaHelper.validatePropertyValue('groupName', property, 'test');
      });

      it('should validate if property is  valid', () => expect(isValid).toBe(true));
    });

    describe('Property is Numeric type', () => {
      let property: Property;
      beforeEach(() => {
        property = {
          ...propertyStub,
          Type: PropertyType.Numeric,
          MinValue: 5,
          MaxValue: 5,
        };
      });
      describe('validate MinValue ', () => {
        beforeEach(() => {
          isValid = schemaHelper.validatePropertyValue('groupName', property, 1);
        });

        it('should validate if property is not valid', () => expect(isValid).toBe(false));
      });

      describe('validate MinValue ', () => {
        beforeEach(() => {
          isValid = schemaHelper.validatePropertyValue('groupName', property, 10);
        });

        it('should validate if property is not valid', () => expect(isValid).toBe(false));
      });
    });

    describe('Property is Complex type', () => {
      let property: Property;
      beforeEach(() => {
        property = {
          ...propertyStub,
          Type: PropertyType.Complex,
          ComplexType: 'complex-type',
        };
        const complexObj: ComplexType = { ...complexStub, Properties: [propertyStub] };
        jest.spyOn(storeStub, 'selectSnapshot').mockReturnValue(() => complexObj);
      });
      describe('validate Complex Properties ', () => {
        beforeEach(() => {
          isValid = schemaHelper.validatePropertyValue('groupName', property, 'test');
        });

        it('should validate if property is valid', () => expect(isValid).toBe(true));
      });
    });

    describe('get Property FromatError message ', () => {
      const message = 'Property Test is not valid';
      const property: Property = {
        ...propertyStub,
        FormatError: message,
        IsRequired: true,
      };
      beforeEach(() => {
        jest.spyOn(storeStub, 'dispatch');
        isValid = schemaHelper.validatePropertyValue('groupName', property, '');
      });

      it('should dispacth SetErrorMessage action with FormatError message', () =>
        expect(storeStub.dispatch).toHaveBeenCalledWith(
          new actions.SetErrorMessage('groupName', property.Name, message)
        ));
    });

    describe('set default Property Error message when DisplayName is defined', () => {
      const property: Property = {
        ...propertyStub,
        FormatError: '',
        IsRequired: true,
      };
      beforeEach(() => {
        jest.spyOn(storeStub, 'dispatch');
        isValid = schemaHelper.validatePropertyValue('groupName', property, '');
      });

      it('should dispacth SetErrorMessage action with FormatError message', () =>
        expect(storeStub.dispatch).toHaveBeenCalledWith(
          new actions.SetErrorMessage(
            'groupName',
            property.Name,
            `${property.DisplayName} is invalid`
          )
        ));
    });
    describe('set default Property Error message when DisplayName is not defined', () => {
      const property: Property = {
        ...propertyStub,
        FormatError: '',
        IsRequired: true,
      };
      beforeEach(() => {
        jest.spyOn(storeStub, 'dispatch');
        isValid = schemaHelper.validatePropertyValue('groupName', property, '');
      });

      it('should dispacth SetErrorMessage action with FormatError message', () =>
        expect(storeStub.dispatch).toHaveBeenCalledWith(
          new actions.SetErrorMessage('groupName', property.Name, `${property.Name} is invalid`)
        ));
    });
  });
});
