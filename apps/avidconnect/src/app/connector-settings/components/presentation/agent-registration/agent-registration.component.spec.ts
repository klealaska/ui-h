import { Component, ViewChild } from '@angular/core';
import { AgentRegistrationComponent } from './agent-registration.component';
import { onPremAgentsStub, registrationStub } from '../../../../../test/test-stubs';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { MatSelectModule } from '@angular/material/select';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatSelectHarness } from '@angular/material/select/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatFormFieldHarness } from '@angular/material/form-field/testing';

import { MatOptionHarness } from '@angular/material/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonHarness } from '@angular/material/button/testing';

@Component({
  selector: 'avc-agent-reg-parent-mock',
  template: `<avc-agent-registration
    #agentReg
    [agentList]="agentList"
    [registration]="registration"
  ></avc-agent-registration>`,
})
export class AgentRegParentMockComponent {
  @ViewChild('agentReg') public agentRegComponent: AgentRegistrationComponent;
  public agentList = onPremAgentsStub;
  public registration = {
    ...registrationStub,
    topic: 'Customer-32325',
    subscription: 'SID-6428644b-47a7-d232-6a2b-8a876165633a',
  };
}

describe('agent registration component', () => {
  let component: AgentRegParentMockComponent;
  let fixture: ComponentFixture<AgentRegParentMockComponent>;
  let loader: HarnessLoader;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AgentRegParentMockComponent, AgentRegistrationComponent],
      imports: [MatSelectModule, NoopAnimationsModule, MatFormFieldModule, MatButtonModule],
    });
    fixture = TestBed.createComponent(AgentRegParentMockComponent);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);
    fixture.detectChanges();
  });

  it('should display the form field', async () => {
    const formField: MatFormFieldHarness = await loader.getHarness(MatFormFieldHarness);
    const select: MatSelectHarness = await loader.getHarness(MatSelectHarness);
    expect(await formField.getLabel()).toBe('Agent');
    expect(component.agentRegComponent.agentControl.value).toEqual(
      component.agentRegComponent.filteredAgentList[0]
    );

    await select.open();
    const agentOptions: MatOptionHarness[] = await select.getOptions();
    expect(await agentOptions[0].getText()).toBe('--');
    expect(await agentOptions[1].getText()).toBe(onPremAgentsStub.items[0].hostName);
    expect(agentOptions.length).toBe(7);
  });

  it('should display the selected option when selected', async () => {
    const cancelBtn: MatButtonHarness = await loader.getHarness(
      MatButtonHarness.with({ text: 'Cancel' })
    );
    const submitBtn: MatButtonHarness = await loader.getHarness(
      MatButtonHarness.with({ text: 'Update Settings' })
    );
    const select: MatSelectHarness = await loader.getHarness(MatSelectHarness);

    expect(await cancelBtn).toBeTruthy();
    expect(await submitBtn).toBeTruthy();
    await select.open();
    const options: MatOptionHarness[] = await select.getOptions();
    await options[1].click();
    expect(await select.getValueText()).toBe(onPremAgentsStub.items[0].hostName);
  });

  it('should emit an event when an option is clicked', async () => {
    jest.spyOn(component.agentRegComponent.agentSelected, 'emit');
    jest.spyOn(component.agentRegComponent, 'handleSubmit');
    const submitBtn: MatButtonHarness = await loader.getHarness(
      MatButtonHarness.with({ text: 'Update Settings' })
    );
    component.agentRegComponent.agentControl.setValue(onPremAgentsStub.items[0]);
    component.agentRegComponent.agentControl.markAsDirty();
    fixture.detectChanges();
    expect(await submitBtn.isDisabled()).toBe(false);

    await submitBtn.click();
    expect(component.agentRegComponent.handleSubmit).toHaveBeenCalledWith(
      onPremAgentsStub.items[0]
    );
    expect(component.agentRegComponent.agentSelected.emit).toHaveBeenCalledWith(
      onPremAgentsStub.items[0]
    );
    expect(await submitBtn.isDisabled()).toBe(true);
  });

  it('should emit an event when the cancel button is clicked', async () => {
    jest.spyOn(component.agentRegComponent.agentRegCancel, 'emit');
    const cancelBtn: MatButtonHarness = await loader.getHarness(
      MatButtonHarness.with({ text: 'Cancel' })
    );
    await cancelBtn.click();
    expect(component.agentRegComponent.agentRegCancel.emit).toHaveBeenCalled();
  });
});
