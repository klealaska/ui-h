import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { OnPremAgent, OnPremAgentItem, Registration } from '../../../../models';
import { FormControl, Validators } from '@angular/forms';
import { maxBy } from 'lodash';

@Component({
  selector: 'avc-agent-registration',
  templateUrl: './agent-registration.component.html',
  styleUrls: ['agent-registration.component.scss'],
})
export class AgentRegistrationComponent implements OnInit {
  @Input() agentList: OnPremAgent;
  @Input() registration: Registration;
  @Output() agentSelected: EventEmitter<OnPremAgentItem> = new EventEmitter<OnPremAgentItem>();
  @Output() agentRegCancel: EventEmitter<void> = new EventEmitter<void>();

  agentControl: FormControl = new FormControl<OnPremAgentItem>(null, Validators.required);
  public filteredAgentList: OnPremAgentItem[] = [];

  public ngOnInit(): void {
    const agentMap = {};
    this.agentList.items.forEach((item: OnPremAgentItem) => {
      if (!(item.hostName in agentMap)) {
        agentMap[item.hostName] = [];
      }
      agentMap[item.hostName].push(item);
    });
    for (const host in agentMap) {
      this.filteredAgentList.push(maxBy<OnPremAgentItem>(agentMap[host], 'id'));
    }
    this.agentControl.setValue(this.setRegisteredAgent());
  }

  public handleSubmit(agent: OnPremAgentItem): void {
    this.agentControl.markAsPristine();
    this.agentSelected.emit(agent);
  }

  private setRegisteredAgent(): OnPremAgentItem {
    if (!!this.registration?.topic && !!this.registration?.subscription) {
      return this.filteredAgentList.filter((agent: OnPremAgentItem, index) => {
        return (
          agent.topic === this.registration.topic &&
          agent.subscription === this.registration.subscription
        );
      })[0];
    }
  }
}
