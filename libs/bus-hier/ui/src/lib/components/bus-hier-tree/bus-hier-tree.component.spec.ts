import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusHierTreeComponent } from './bus-hier-tree.component';

describe('BusHierTreeComponent', () => {
  let component: BusHierTreeComponent;
  let fixture: ComponentFixture<BusHierTreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BusHierTreeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BusHierTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should handle select node click event', () => {
    const spy = jest.spyOn(component.selectNode, 'emit');
    component.onClick(null);
    expect(spy).toHaveBeenCalled();
  });
});
