import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusHierTreeNodeComponent } from './bus-hier-tree-node.component';

describe('BusHierTreeNodeComponent', () => {
  let component: BusHierTreeNodeComponent;
  let fixture: ComponentFixture<BusHierTreeNodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BusHierTreeNodeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BusHierTreeNodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle click', () => {
    const spy = jest.spyOn(component.clicked, 'emit');
    component.onClick();
    expect(spy).toHaveBeenCalled();
  });
  it('should get name with a string and return string', () => {
    const result = component.getName('company name');
    expect(result).toBe('company name');
  });
  it('should get name with an object and return singular name', () => {
    component.count = 1;
    component.name = { singular: 'company', plural: 'companies' };
    const result = component.getName(component.name);
    expect(result).toBe('company');
  });
  it('should get name with an object and return plural name', () => {
    component.count = 2;
    component.name = { singular: 'company', plural: 'companies' };
    const result = component.getName(component.name);
    expect(result).toBe('companies');
  });
});
