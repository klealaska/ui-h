import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BamlistSkeletonComponent } from './bam-list-skeleton.component';

describe('list skeleton', () => {
  let component: BamlistSkeletonComponent;
  let fixture: ComponentFixture<BamlistSkeletonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BamlistSkeletonComponent],
    });

    fixture = TestBed.createComponent(BamlistSkeletonComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
});
