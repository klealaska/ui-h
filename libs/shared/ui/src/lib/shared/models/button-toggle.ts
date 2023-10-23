import { MatButtonToggleAppearance } from '@angular/material/button-toggle';

export interface MatButtonToggleOptions {
  appearance?: MatButtonToggleAppearance;
  btnText: string;
  checked?: boolean;
  disableRipple?: boolean;
  disabled?: boolean;
  id?: string;
  name?: string;
  value: any;
}
