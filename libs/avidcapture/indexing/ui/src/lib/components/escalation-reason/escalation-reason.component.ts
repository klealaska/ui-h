import { Component, Input, OnInit } from '@angular/core';
import { Activity, ActivityTypes, EscalationCategoryTypes } from '@ui-coe/avidcapture/shared/types';

@Component({
  selector: 'xdc-escalation-reason',
  templateUrl: './escalation-reason.component.html',
  styleUrls: ['./escalation-reason.component.scss'],
})
export class EscalationReasonComponent implements OnInit {
  @Input() activity: Activity;

  escalationLabel = '';
  activityTypes = ActivityTypes; // for the template
  escalationCategoryTypes = EscalationCategoryTypes; // for template

  ngOnInit(): void {
    if (this.activity.escalation != null) {
      this.escalationLabel = this.activity.escalation.category.reason
        ? `${this.activity.escalation.category.issue} - ${this.activity.escalation.category.reason}`
        : this.activity.escalation.category.issue;
    }
  }
}
