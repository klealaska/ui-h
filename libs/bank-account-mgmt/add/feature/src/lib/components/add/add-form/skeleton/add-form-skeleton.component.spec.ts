import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddFormSkeletonComponent } from './add-form.skeleton.component';

describe('bank account header skeleton', () => {
  let component: AddFormSkeletonComponent;
  let fixture: ComponentFixture<AddFormSkeletonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AddFormSkeletonComponent],
    });
    fixture = TestBed.createComponent(AddFormSkeletonComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
});
