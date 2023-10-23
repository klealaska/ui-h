import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusHierToggleCardComponent } from './bus-hier-toggle-card.component';
import { IItemSelection } from '@ui-coe/bus-hier/shared/types';
import { ButtonComponent, TagComponent } from '@ui-coe/shared/ui-v2';

describe('BusHierToggleCardComponent', () => {
  let component: BusHierToggleCardComponent;
  let fixture: ComponentFixture<BusHierToggleCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TagComponent, ButtonComponent],
      declarations: [BusHierToggleCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BusHierToggleCardComponent);
    component = fixture.componentInstance;
    component.id = 'foo';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit toggleItemSelection when selectBtnClick is called', () => {
    const selectData: IItemSelection = {
      id: 'foo',
      isSelected: true,
    };
    const spy = jest.spyOn(component.toggleItemSelection, 'emit').mockReturnValue();
    component.selectBtnClick();
    expect(spy).toHaveBeenCalledWith(selectData);
  });
});
