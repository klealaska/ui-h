import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TooltipDirective } from '../../tooltip/tooltip.directive';
import { MatIconModule } from '@angular/material/icon';
import { InputTooltip } from '@ui-coe/shared/types';
import { Validators } from '@angular/forms';

@Component({
  selector: 'ax-input-header',
  standalone: true,
  imports: [CommonModule, TooltipDirective, MatIconModule],
  templateUrl: './input-header.component.html',
  styleUrls: ['./input-header.component.scss'],
})
export class InputHeaderComponent implements OnInit {
  @Input() readonly: boolean;
  @Input() id: string;
  @Input() label: string;
  @Input() optional = true;
  @Input() control: any;
  @Input() tooltip: InputTooltip;

  public required = false;

  ngOnInit() {
    // Check if if a control or FormControl is passed down
    // Update Required if Validator required is on control
    if (this.control && !this.control.controls)
      this.required = this.control?.hasValidator(Validators.required);
    else if (this.control?.controls) {
      Object.keys(this.control?.controls).forEach(key => {
        this.required = this.control?.controls[key].hasValidator(Validators.required);
      });
    }
  }
}
