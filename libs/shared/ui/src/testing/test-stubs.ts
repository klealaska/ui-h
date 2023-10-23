import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Autocomplete } from '../lib/shared/models/ax-autocomplete';

export const domSantizerStub: DomSanitizer = {
  bypassSecurityTrustHtml: (value: string) => value,
} as any;

export const iconRegistryStub: MatIconRegistry = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  addSvgIconLiteral: (iconName: string, literal: SafeHtml) => iconName,
} as any;

export const fieldModelStub = {
  key: 'mockKey',
  value: 'mockValue',
  required: true,
};

const group: any = {};
group[fieldModelStub.key] = fieldModelStub.required
  ? new UntypedFormControl(fieldModelStub.value || '', Validators.required)
  : new UntypedFormControl(fieldModelStub.value || '');

export const fieldModelFormGroupStub = new UntypedFormGroup(group);

export const itemStub: Autocomplete = {
  id: '1',
  name: 'mock',
};
