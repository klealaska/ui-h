export interface DropdownOption {
  name: string;
  value: any;
}

export interface DropdownOptionGroup {
  name: string;
  disabled?: boolean;
  options: DropdownOption[];
}
