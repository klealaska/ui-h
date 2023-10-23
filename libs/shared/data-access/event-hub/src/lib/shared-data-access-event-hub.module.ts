import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventHubFacade } from './+state/event-hub.facade';

@NgModule({
  imports: [CommonModule],
  providers: [EventHubFacade],
})
export class SharedDataAccessEventHubModule {}
