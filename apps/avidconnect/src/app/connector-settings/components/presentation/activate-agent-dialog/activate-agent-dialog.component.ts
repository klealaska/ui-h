import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'avc-activate-agent-dialog',
  templateUrl: './activate-agent-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./activate-agent-dialog.component.scss'],
})
export class ActivateAgentDialogComponent {
  public activationCodeControl = new FormControl('', [
    Validators.required,
    Validators.minLength(24),
    Validators.maxLength(24),
  ]);
}
