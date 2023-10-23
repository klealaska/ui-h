import { DeactivateAgentDialogComponent } from './deactivate-agent-dialog.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { OnPremAgentItem } from '../../../../models';
import { By } from '@angular/platform-browser';
import { MatButtonHarness } from '@angular/material/button/testing';

describe('deactivate agent', () => {
  let component: DeactivateAgentDialogComponent;
  let fixture: ComponentFixture<DeactivateAgentDialogComponent>;
  let loader: HarnessLoader;

  const mockOnPremAgentItem: OnPremAgentItem = {
    id: 1,
    customerId: 32325,
    agentSID: 'a37a1310-d718-27b3-8180-769a55d25cb0',
    isDeactivated: false,
    isLockedOut: false,
    hostName: 'G6KQRQ2.AvidXchange.com',
    topic: 'Customer-32325',
    subscription: 'SID-a37a1310-d718-27b3-8180-769a55d25cb0',
    createdDate: '2023-02-22T09:04:26.9',
    createdBy: 'N/A',
    deactivatedDate: '0001-01-01T00:00:00',
    deactivatedBy: null,
    lastAccess: '2023-02-22T09:04:26.9',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeactivateAgentDialogComponent],
      imports: [MatDialogModule, MatButtonModule],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: mockOnPremAgentItem,
        },
      ],
    });

    fixture = TestBed.createComponent(DeactivateAgentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    loader = TestbedHarnessEnvironment.documentRootLoader(fixture);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display the appropriate dialog content', () => {
    const contentElem: HTMLElement = fixture.debugElement.query(
      By.css('.mat-dialog-content')
    ).nativeElement;
    expect(contentElem.textContent).toContain(mockOnPremAgentItem.hostName);
  });

  it('should display the buttons', async () => {
    const buttons: MatButtonHarness[] = await loader.getAllHarnesses(MatButtonHarness);
    expect(buttons.length).toBe(2);
    expect(await loader.getHarness(MatButtonHarness.with({ text: 'Cancel' }))).toBeTruthy();
    expect(await loader.getHarness(MatButtonHarness.with({ text: 'Yes' }))).toBeTruthy();
  });
});
