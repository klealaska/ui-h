import { ActivateAgentDialogComponent } from './activate-agent-dialog.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldHarness } from '@angular/material/form-field/testing';
import { MatInputModule } from '@angular/material/input';
import { By } from '@angular/platform-browser';
import { MatInputHarness } from '@angular/material/input/testing';

describe('activate agent dialog', () => {
  let component: ActivateAgentDialogComponent;
  let fixture: ComponentFixture<ActivateAgentDialogComponent>;
  let loader: HarnessLoader;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ActivateAgentDialogComponent],
      imports: [
        MatDialogModule,
        NoopAnimationsModule,
        MatInputModule,
        MatFormFieldModule,
        ReactiveFormsModule,
      ],
    });
    fixture = TestBed.createComponent(ActivateAgentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    loader = TestbedHarnessEnvironment.documentRootLoader(fixture);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load form field harness', async () => {
    const formFields = await loader.getAllHarnesses(MatFormFieldHarness);
    expect(formFields.length).toBe(1);
  });

  it('should display the correct dialog content', () => {
    const contentElem: HTMLElement = fixture.debugElement.query(
      By.css('.mat-dialog-content')
    ).nativeElement;
    expect(contentElem.textContent).toContain('Enter Activation Code');
  });

  it('should check to see if the input is valid', async () => {
    const formField = await loader.getHarness(MatFormFieldHarness);
    const input = await loader.getHarness(MatInputHarness);
    await input.setValue('1111 1111 1111 1111 1111');
    expect(await formField.isControlValid()).toBe(true);

    await input.setValue('111');
    await input.blur();
    const errorElem = fixture.debugElement.query(By.css('mat-error')).nativeElement;
    expect(errorElem.textContent).toContain('Code must be 20 digits.');
    expect(await formField.isControlValid()).toBe(false);
  });
});
