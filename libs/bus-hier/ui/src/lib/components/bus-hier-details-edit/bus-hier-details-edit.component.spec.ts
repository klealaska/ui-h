import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BusHierDetailsEditComponent } from './bus-hier-details-edit.component';
import { HierarchyType, IEditEntity } from '@ui-coe/bus-hier/shared/types';
import { ButtonComponent, InputComponent, TagComponent } from '@ui-coe/shared/ui-v2';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';

describe('BusHierDetailsEditComponent', () => {
  let component: BusHierDetailsEditComponent;
  let fixture: ComponentFixture<BusHierDetailsEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BusHierDetailsEditComponent],
      imports: [
        ButtonComponent,
        BrowserAnimationsModule,
        InputComponent,
        TagComponent,
        ReactiveFormsModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BusHierDetailsEditComponent);
    component = fixture.componentInstance;
    component.details = {
      id: 'foo',
      name: 'bar',
      code: 'baz',
      status: 'Active',
      type: HierarchyType.ORGANIZATION,
    };
    component.errors = ['is required', 'max length is 100'];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit saveOrgDetails when onSaveButtonClick is called', () => {
    const spy = jest.spyOn(component.saveDetails, 'emit');

    component.editFormGroup.value.name = 'fooName';
    component.editFormGroup.value.code = 'fooCode';

    const ent: IEditEntity = {
      id: 'foo',
      body: {
        name: 'fooName',
        code: 'fooCode',
      },
      type: HierarchyType.ORGANIZATION,
    };
    component.onSaveButtonClick();
    expect(spy).toHaveBeenCalledWith(ent);
  });

  it('should emit toggleEditDetailsMode when onCancelButtonClick is called', () => {
    const spy = jest.spyOn(component.toggleEditDetailsMode, 'emit');

    component.onCancelButtonClick();
    expect(spy).toHaveBeenCalledWith(false);
  });

  it('should generate error required message for field', () => {
    const name = component.requiredErrorMessage('name');
    expect(name).toStrictEqual({ icon: 'warning', message: 'name is required' });
  });
  it('should generate error max length message for field', () => {
    const name = component.maxLengthErrorMessage('code');
    expect(name).toStrictEqual({ icon: 'warning', message: 'code max length is 100' });
  });

  it('should generate error max length message for field when invalid', () => {
    component.editFormGroup.controls.code.setValue('a'.repeat(101));
    const code = component.buildErrorMessage('code');
    expect(code).toStrictEqual({ icon: 'warning', message: 'code max length is 100' });
  });
  it('should generate error required message for field when invalid', () => {
    component.editFormGroup.controls.name.setValue('');
    const name = component.buildErrorMessage('name');
    expect(name).toStrictEqual({ icon: 'warning', message: 'name is required' });
  });
});
